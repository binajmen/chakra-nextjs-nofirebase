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
  Alert,
  AlertIcon,
  useToast
} from '@chakra-ui/react'
import { FaEllipsisV, FaTrash, FaPlus } from 'react-icons/fa'

import { Loading, Error } from '@/components/Suspense'
import Button from '@/components/atoms/Button'
import { reorder } from '@/helpers/index'

import type { Catalog, Category } from '@/types/catalog'

export default function CatalogEdit() {
  const { t } = useTranslation('common')
  const toast = useToast()
  const router = useRouter()
  const { placeId, catalogId } = router.query

  const catalog = useDocument<Catalog>(`places/${placeId}/catalogs/${catalogId}`)
  const categories = useCollection<Category>(`places/${placeId}/categories`)

  if (catalog.loading || categories.loading) {
    return <Loading />
  } else if (catalog.error || categories.error) {
    return <Error error={catalog.error ?? categories.error} />
  } else if (catalog.data && categories.data) {
    return (
      <Box>
        <Heading mb="6">{t('catalog')} – {catalog.data.name}</Heading>
        <Formik
          initialValues={catalog.data}
          validationSchema={Yup.object({
            name: Yup.string().required(),
            description: Yup.string().required(),
          })}
          onSubmit={(values, actions) => {
            const { name, description, categories } = values
            catalog.update({ name, description, categories })!
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
                <Field name="categories">
                  {({ field, form, meta }: FieldProps) => (
                    <FormControl isInvalid={!!meta.error && !!meta.touched}>
                      <FormLabel htmlFor="description">{t('manager:categories')}</FormLabel>
                      <SelectedCategories
                        categories={categories.data!}
                        selected={field.value}
                        saveSelection={form.setFieldValue} />
                      <FormLabel htmlFor="description" mt="6">{t('manager:unselected-categories')}</FormLabel>
                      <UnselectedCategories
                        categories={categories.data!}
                        selected={field.value}
                        saveSelection={form.setFieldValue} />
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

type CategoriesProps = {
  categories: Document<Category>[]
  selected: string[]
  saveSelection: (field: string, value: any, shouldValidate?: boolean | undefined) => void
}

function SelectedCategories({ categories, selected, saveSelection }: CategoriesProps) {
  const { t } = useTranslation('common')

  const list = selected.map(id => categories.find(c => c.id === id))
    .filter(category => category !== undefined)

  function remove(categoryId: string) {
    saveSelection("categories", selected.filter(id => id !== categoryId))
  }

  function onDragEnd(result: any) {
    if (!result.destination) return
    if (result.destination.index === result.source.index) return

    const newOrder = reorder(
      selected,
      result.source.index,
      result.destination.index
    )

    saveSelection("categories", newOrder)
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
                  <Th>{t('manager:name')}</Th>
                  <Th>{t('manager:description')}</Th>
                  <Th w="1"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {list.map((category, index) => (
                  <Draggable key={category!.id} draggableId={category!.id} index={index}>
                    {provided => (
                      <Tr ref={provided.innerRef} {...provided.draggableProps} _hover={{ bgColor: 'primary.50' }}>
                        <Td {...provided.dragHandleProps}><Icon as={FaEllipsisV} /></Td>
                        <Td>{category!.name}</Td>
                        <Td>{category!.description}</Td>
                        <Td>
                          <Button
                            leftIcon={<FaTrash />}
                            size="xs"
                            onClick={() => remove(category!.id)}
                          >
                            {t('delete')}
                          </Button>
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
        Aucune catégorie sélectionnée.
      </Alert>
    )
  }
}

function UnselectedCategories({ categories, selected, saveSelection }: CategoriesProps) {
  const { t } = useTranslation('common')

  const list = categories.filter(c => !selected.includes(c.id))

  function add(categoryId: string) {
    saveSelection("categories", [...selected, categoryId])
  }

  if (list.length) {
    return (
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>{t('manager:name')}</Th>
            <Th>{t('manager:description')}</Th>
            <Th w="1"></Th>
          </Tr>
        </Thead>
        <Tbody>
          {list.map(category => (
            <Tr key={category.id} _hover={{ bgColor: 'primary.50' }}>
              <Td>{category.name}</Td>
              <Td>{category.description}</Td>
              <Td>
                <Button
                  leftIcon={<FaPlus />}
                  size="xs"
                  onClick={() => add(category.id)}
                >
                  {t('add')}
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    )
  } else {
    return (
      <Alert status="info" colorScheme="gray" borderRadius="lg">
        <AlertIcon />
        Toutes les catégories sont sélectionnées.
      </Alert>
    )
  }
}
