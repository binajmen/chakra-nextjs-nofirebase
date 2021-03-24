import * as React from 'react'
import * as Yup from 'yup'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { useDocument, useCollection, Document } from '@nandorojo/swr-firestore'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Formik, Form, Field, FieldProps } from 'formik'

import {
  Box,
  Stack,
  Center,
  Heading,
  Text,
  Icon,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Alert,
  AlertIcon,
  useToast,
  useDisclosure,
  UseDisclosureProps
} from '@chakra-ui/react'
import { FaEllipsisV, FaTrash, FaEdit, FaPlus } from 'react-icons/fa'

import { Loading, Error } from '@/components/Suspense'
import Button from '@/components/atoms/Button'
import IconButton from '@/components/atoms/IconButton'

import { reorder, objToArr, stripDocument } from '@/helpers/index'

import type { Category, Product, Event, Modifier } from '@/types/catalog'

export default function CatalogEdit() {
  const { t } = useTranslation('common')
  const productsModal = useDisclosure()
  const eventsModal = useDisclosure()
  const modifiersModal = useDisclosure()
  const toast = useToast()
  const router = useRouter()
  const { placeId, categoryId } = router.query

  const category = useDocument<Category>(`places/${placeId}/categories/${categoryId}`)
  const products = useCollection<Product>(`places/${placeId}/products`)
  const events = useCollection<Event>(eventsModal.isOpen ? `places/${placeId}/events` : null)
  const modifiers = useCollection<Modifier>(modifiersModal.isOpen ? `places/${placeId}/modifiers` : null)

  if (category.loading || products.loading) {
    return <Loading />
  } else if (category.error || products.error) {
    return <Error error={category.error ?? products.error} />
  } else if (category.data && products.data) {
    return (
      <Box>
        <Heading mb="6">{t('manager:category')} – {category.data.name}</Heading>
        <Formik
          initialValues={category.data}
          validationSchema={Yup.object({
            name: Yup.string().required(),
            description: Yup.string().required(),
            products: Yup.array().of(Yup.string())
            // events
            // modifiers
          })}
          onSubmit={(values, actions) => {
            const { name, description, products, events, modifiers } = values

            category.update({ name, description, products, events, modifiers })!
              .then(() => toast({
                description: t('manager:changes-saved'),
                status: "success"
              }))
              .catch((error) => toast({
                description: error.message,
                status: "error"
              }))

            actions.setSubmitting(false)
          }}
        >
          {(props) => (
            <Form>
              <Stack direction="column" spacing="6">
                <Field name="name">
                  {({ field, form, meta }: FieldProps) => (
                    <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                      <FormLabel htmlFor="name">{t('manager:name')}</FormLabel>
                      <Input {...field} id="name" placeholder="" />
                      <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="description">
                  {({ field, form, meta }: FieldProps) => (
                    <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                      <FormLabel htmlFor="description">{t('manager:description')}</FormLabel>
                      <Input {...field} id="description" placeholder="" />
                      <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="products">
                  {({ field, form, meta }: FieldProps) => (
                    <FormControl isInvalid={!!meta.error && !!meta.touched}>
                      <FormLabel htmlFor="description">
                        <Stack direction="row" spacing="6">
                          <Center><Text>{t('manager:products')}</Text></Center>
                          <Button
                            leftIcon={<FaPlus />}
                            size="sm"
                            onClick={productsModal.onOpen}>
                            {t('add')}
                          </Button>
                        </Stack>
                      </FormLabel>
                      <List
                        itemIds={field.value ?? []}
                        items={products.data ?? []}
                        keys={["name", "description"]}
                        onRemove={(itemId) => {
                          form.setFieldValue("products", field.value.filter((id: string) => id !== itemId))
                        }}
                        onReorder={(itemIds) => {
                          form.setFieldValue("products", itemIds)
                        }}
                        editPath={{
                          pathname: "/manage/[placeId]/products/[productId]",
                          queryId: "productId"
                        }}
                      />
                      <SelectionModal
                        modal={productsModal}
                        title="Ajout de produits"
                        selected={field.value}
                        items={products.data!}
                        keys={["name", "description", "price"]}
                        transform={{
                          "price": (value) => `${value / 100}€`
                        }}
                        add={(item) => {
                          form.setFieldValue("products", [...field.value, item.id])
                        }} />
                      <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="events">
                  {({ field, form, meta }: FieldProps) => (
                    <FormControl isInvalid={!!meta.error && !!meta.touched}>
                      <FormLabel htmlFor="description">
                        <Stack direction="row" spacing="6">
                          <Center><Text>{t('manager:events')}</Text></Center>
                          <Button
                            leftIcon={<FaPlus />}
                            size="sm"
                            onClick={eventsModal.onOpen}>
                            {t('add')}
                          </Button>
                        </Stack>
                      </FormLabel>
                      <List
                        itemIds={field.value.order ?? []}
                        items={field.value.event ?? []}
                        keys={["name", "description"]}
                        onRemove={(itemId) => {
                          const newOrder = field.value.order.filter((id: string) => id !== itemId)
                          const newEvent = field.value.event
                          delete newEvent[itemId]
                          form.setFieldValue("events", { order: newOrder, event: newEvent })
                        }}
                        onReorder={(itemIds) => {
                          form.setFieldValue("events", { ...field.value, order: itemIds })
                        }}
                        editPath={{
                          pathname: "/manage/[placeId]/events/[eventId]",
                          queryId: "eventId"
                        }}
                      />
                      <SelectionModal
                        modal={eventsModal}
                        title="Ajout d'événements"
                        selected={field.value.order ?? []}
                        items={events.data! ?? []}
                        keys={["name", "description"]}
                        add={(item) => {
                          const { id, ...event } = stripDocument(item)
                          if ("order" in field.value && "event" in field.value) {
                            form.setFieldValue("events", {
                              order: [...field.value.order, id],
                              event: { ...field.value.event, [id]: event }
                            })
                          } else {
                            form.setFieldValue("events", {
                              order: [id],
                              event: { [id]: event }
                            })
                          }
                        }} />
                      <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="modifiers">
                  {({ field, form, meta }: FieldProps) => (
                    <FormControl isInvalid={!!meta.error && !!meta.touched}>
                      <FormLabel htmlFor="description">
                        <Stack direction="row" spacing="6">
                          <Center><Text>{t('manager:modifiers')}</Text></Center>
                          <Button
                            leftIcon={<FaPlus />}
                            size="sm"
                            onClick={modifiersModal.onOpen}>
                            {t('add')}
                          </Button>
                        </Stack>
                      </FormLabel>
                      <List
                        itemIds={field.value.order ?? []}
                        items={field.value.modifier ?? []}
                        keys={["name", "description"]}
                        onRemove={(itemId) => {
                          const newOrder = field.value.order.filter((id: string) => id !== itemId)
                          const newModifier = field.value.modifier
                          delete newModifier[itemId]
                          form.setFieldValue("modifiers", {
                            ...field.value,
                            order: newOrder,
                            modifier: newModifier
                          })
                        }}
                        onReorder={(itemIds) => {
                          form.setFieldValue("modifiers", {
                            ...field.value,
                            order: itemIds
                          })
                        }}
                        editPath={{
                          pathname: "/manage/[placeId]/modifiers/[modifierId]",
                          queryId: "modifierId"
                        }}
                      />
                      <SelectionModal
                        modal={modifiersModal}
                        title="Ajout d'options"
                        selected={field.value.order ?? []}
                        items={modifiers.data! ?? []}
                        keys={["name", "description"]}
                        add={(item) => {
                          const { id, ...modifier } = stripDocument(item)
                          if ("order" in field.value && "modifier" in field.value) {
                            form.setFieldValue("modifiers", {
                              order: [...field.value.order, id],
                              modifier: { ...field.value.event, [id]: modifier }
                            })
                          } else {
                            form.setFieldValue("modifiers", {
                              order: [id],
                              modifier: { [id]: modifier }
                            })
                          }
                        }} />
                      <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Center>
                  <Button type="submit" isLoading={props.isSubmitting}>{t('save')}</Button>
                </Center>
              </Stack>
            </Form>
          )}
        </Formik>

      </Box>
    )
  }

  return null
}

type ListProps = {
  itemIds: string[]
  items: any[] | object
  price?: { [index: string]: number }
  editPrice?: (itemId: string, price: number) => void
  keys: string[]
  onRemove: (itemId: string) => void
  onReorder: (itemIds: string[]) => void
  editPath: {
    pathname: string,
    queryId: string
  }
}

function List({ itemIds, items, keys, onRemove, onReorder, editPath, price, editPrice }: ListProps) {
  const { t } = useTranslation('common')
  const router = useRouter()
  const placeId = router.query.placeId

  const list = React.useMemo(() => {
    const itemsArr = Array.isArray(items) ? items : objToArr(items)
    return itemIds.map(id => itemsArr.find(i => i.id === id))
      .filter(item => item !== undefined)
  }, [itemIds, items])

  function remove(itemId: string) {
    onRemove(itemId)
  }

  function onDragEnd(result: any) {
    if (!result.destination) return
    if (result.destination.index === result.source.index) return

    const newOrder = reorder(
      itemIds,
      result.source.index,
      result.destination.index
    )

    onReorder(newOrder)
  }

  function edit(itemId: string) {
    if (window.confirm('You will lose all the changes')) {
      const { pathname, queryId } = editPath
      router.push({
        pathname,
        query: { placeId, [queryId]: itemId }
      })
    }
  }

  if (list.length) {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {provided => (
            <Table variant="simple" ref={provided.innerRef}>
              <Thead>
                <Tr>
                  <Th w="1"></Th>
                  {keys.map(key => (
                    <Th key={key}>{t(`manager:${key}`)}</Th>
                  ))}
                  {price && <Th>{t(`manager:price`)}</Th>}
                  <Th w="1"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {list.map((item, index) => (
                  <Draggable key={item!.id} draggableId={item!.id} index={index}>
                    {provided => (
                      <Tr ref={provided.innerRef} {...provided.draggableProps} _hover={{ bgColor: 'primary.50' }}>
                        <Td {...provided.dragHandleProps}><Icon as={FaEllipsisV} /></Td>
                        {keys.map(key => (
                          <Td key={key}>
                            {item[key]}
                          </Td>
                        ))}
                        {price &&
                          <Td>
                            {price[item!.id] / 100}€
                          </Td>
                        }
                        <Td>
                          <Stack direction="row" spacing="2">
                            <Center>
                              <Button
                                aria-label="edit"
                                leftIcon={<FaEdit />}
                                size="sm"
                                onClick={() => edit(item!.id)}
                              >
                                {t('edit')}
                              </Button>
                            </Center>
                            <IconButton
                              aria-label="remove"
                              icon={<FaTrash />}
                              size="sm"
                              onClick={() => remove(item!.id)}
                              colorScheme="red"
                              color="tomato"
                              variant="ghost" />
                          </Stack>
                        </Td>
                      </Tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Tbody>
            </Table>
          )}
        </Droppable>
      </DragDropContext>
    )
  } else {
    return (
      <Alert status="warning" colorScheme="gray" borderRadius="lg">
        <AlertIcon />
        Aucun élément sélectionné.
      </Alert>
    )
  }
}

type SelectionModalProps = {
  modal: UseDisclosureProps
  title: string
  selected: string[]
  items: any[]
  keys: string[]
  transform?: { [index: string]: (value: any) => any }
  add: (item: any) => void
}

function SelectionModal({ modal, title, selected, items, keys, transform = {}, add }: SelectionModalProps) {
  const { t } = useTranslation('common')

  const list = React.useMemo(() => {
    return items.filter(i => !selected.includes(i.id))
  }, [items, selected])

  return (
    <Modal onClose={modal.onClose!} size="4xl" isOpen={modal.isOpen!}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                {keys.map(key => (
                  <Th key={key}>{t(`manager:${key}`)}</Th>
                ))}
                <Th w="1"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {list.map(item => (
                <Tr key={item.id} _hover={{ bgColor: 'primary.50' }}>
                  {keys.map(key => (
                    <Td key={key}>
                      {key in transform ? transform[key](item[key]) : item[key]}
                    </Td>
                  ))}
                  <Td>
                    <Button
                      leftIcon={<FaPlus />}
                      size="xs"
                      onClick={() => add(item)}
                    >
                      {t('add')}
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button onClick={modal.onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
