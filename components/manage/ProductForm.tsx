import * as React from 'react'
import * as Yup from 'yup'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { useCollection } from '@nandorojo/swr-firestore'
import { Formik, Form, Field, FieldProps } from 'formik'

import {
  Box,
  Flex,
  Stack,
  Center,
  Heading,
  Text,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightAddon,
  useToast,
  useDisclosure,
} from '@chakra-ui/react'
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa'

import firebase from '@/lib/firebase/client'

import Button from '@/components/atoms/Button'
import CentsPriceField from '@/components/atoms/CentsPriceField'
import TagsField from '@/components/atoms/TagsField'
import ImageField from '@/components/atoms/ImageField'
import List from './List'
import SelectionModal from './SelectionModal'

import { stripDocument } from '@/helpers/index'
import { TAGS } from '@/helpers/constants'

import type { Product, Event, Modifier } from '@/types/catalog'

const initialValues: Product = {
  available: true,
  name: "",
  description: "",
  code: "",
  imageUrl: "",
  price: 0,
  tax: 0,
  tags: [],
  events: {
    order: [],
    event: {}
  },
  modifiers: {
    order: [],
    modifier: {}
  },
  categoryIds: [],
  modifierIds: [],
  type: "product"
}

type ProductFormProps = {
  product?: Product
  save: (product: Product) => Promise<any> | null
}

export default function ProductForm({ product, save }: ProductFormProps) {
  const { t } = useTranslation('admin')
  const eventsModal = useDisclosure()
  const modifiersModal = useDisclosure()
  const toast = useToast()
  const router = useRouter()
  const { placeId } = router.query
  const [tempImageUrl, setTempImageUrl] = React.useState<string>("")
  const tempImageRef = React.useRef<string>("")
  const previousImageUrl = product?.imageUrl ?? ""

  const events = useCollection<Event>(eventsModal.isOpen ? `places/${placeId}/events` : null)
  const modifiers = useCollection<Modifier>(modifiersModal.isOpen ? `places/${placeId}/modifiers` : null)

  function onImage(imageUrl: string) {
    if (tempImageUrl !== "") {
      deleteImage(tempImageUrl).then(() => setTempImageUrl(imageUrl))
    } else {
      setTempImageUrl(imageUrl)
    }
  }

  function deleteImage(imageUrl: string) {
    let httpsRef = firebase.storage().refFromURL(imageUrl)
    return httpsRef.delete().catch((error) => console.error(error))
  }

  React.useEffect(() => {
    tempImageRef.current = tempImageUrl
  }, [tempImageUrl])

  React.useEffect(() => {
    return () => {
      if (tempImageRef.current !== "") {
        deleteImage(tempImageRef.current).then(() => console.log("product not saved: deleting temporary uploaded image"))
      }
    }
  }, [])

  return (
    <Box>
      <Heading mb="6">{t('product')} – {product ? product.name : t('new')}</Heading>
      <Formik
        initialValues={product ? product : initialValues}
        validationSchema={Yup.object({
          // available
          name: Yup.string().required(),
          description: Yup.string().required(),
          // code: Yup.string(),
          imageUrl: Yup.string(),
          price: Yup.number().required().min(0),
          tax: Yup.number().required().min(0),
          tags: Yup.array().of(Yup.string().oneOf(TAGS)),
          // events
          // modifiers
          // categoryIds
          // modifierIds
          // type
        })}
        onSubmit={(values, actions) => {
          const { available, name, description, code, imageUrl, price, tax, tags, events, modifiers, categoryIds, modifierIds, type } = values

          save({ available, name, description, code, imageUrl, price, tax, tags, events, modifiers, categoryIds, modifierIds, type })!
            .then(() => toast({
              description: t('changes-saved'),
              status: "success"
            }))
            .catch((error) => toast({
              description: error.message,
              status: "error"
            }))

          if (previousImageUrl !== imageUrl && previousImageUrl !== "") {
            deleteImage(previousImageUrl)
              .then(() => console.log("old image deleted"))
          }

          setTempImageUrl("")
          actions.setSubmitting(false)

          router.push({
            pathname: "/manage/[placeId]/products",
            query: { placeId }
          })
        }}
      >
        {(props) => (
          <Form>
            <Stack direction="column" spacing="6">
              <Flex>
                <Stack flex="1" direction="column" spacing="6">
                  <Field name="name">
                    {({ field, form, meta }: FieldProps) => (
                      <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                        <FormLabel htmlFor="name">{t('name')}</FormLabel>
                        <Input {...field} id="name" placeholder="" />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="description">
                    {({ field, form, meta }: FieldProps) => (
                      <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                        <FormLabel htmlFor="description">{t('description')}</FormLabel>
                        <Input {...field} id="description" placeholder="" />
                        <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Stack direction="row">
                    <Field name="price">
                      {({ field, form, meta }: FieldProps) => (
                        <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                          <FormLabel htmlFor="price">{t('price')}</FormLabel>
                          <CentsPriceField
                            {...field}
                            id="price"
                            onPrice={(value) => {
                              form.setFieldValue("price", value)
                            }} />
                          <FormHelperText>100 = 1€</FormHelperText>
                          <FormErrorMessage>{form.errors.price}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="tax">
                      {({ field, form, meta }: FieldProps) => (
                        <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                          <FormLabel htmlFor="tax">{t('tax')}</FormLabel>
                          <InputGroup>
                            <Input {...field} id="name" placeholder="" />
                            <InputRightAddon children="%" />
                          </InputGroup>
                          <FormErrorMessage>{form.errors.tax}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Stack>
                  {/* <Field name="code">
                  {({ field, form, meta }: FieldProps) => (
                    <FormControl isInvalid={!!meta.error && !!meta.touched}>
                      <FormLabel htmlFor="code">{t('code')}</FormLabel>
                      <Input {...field} id="code" placeholder="" />
                      <FormErrorMessage>{form.errors.code}</FormErrorMessage>
                    </FormControl>
                  )}
                  </Field> */}
                </Stack>
                <Box flex="1" pl="6">
                  <Field name="imageUrl">
                    {({ field, form, meta }: FieldProps) => (
                      <FormControl isInvalid={!!meta.error && !!meta.touched} h="full">
                        <FormLabel htmlFor="imageUrl">
                          <Stack direction="row" spacing="6">
                            <Center><Text>{t('image')}</Text></Center>
                            {(field.value ?? "") !== "" &&
                              <Button
                                leftIcon={<FaTrash />}
                                size="xs"
                                color="red.400"
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => {
                                  form.setFieldValue("imageUrl", "")
                                }}>
                                {t('delete')}
                              </Button>
                            }
                          </Stack>
                        </FormLabel>
                        <ImageField
                          {...field}
                          storagePath={`images/${placeId}`}
                          onImage={(imageUrl) => {
                            onImage(imageUrl)
                            form.setFieldValue("imageUrl", imageUrl)
                          }}
                        />
                        <FormErrorMessage>{form.errors.imageUrl}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Box>
              </Flex>
              <Field name="tags">
                {({ field, form, meta }: FieldProps) => (
                  <FormControl isInvalid={!!meta.error && !!meta.touched}>
                    <FormLabel htmlFor="tags">{t('tags')}</FormLabel>
                    <TagsField
                      tags={field.value}
                      onTag={(tags) => {
                        form.setFieldValue("tags", tags)
                      }}
                    />
                    <FormErrorMessage>{form.errors.tags}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="events">
                {({ field, form, meta }: FieldProps) => (
                  <FormControl isInvalid={!!meta.error && !!meta.touched}>
                    <FormLabel htmlFor="description">
                      <Stack direction="row" spacing="6">
                        <Center><Text>{t('events')}</Text></Center>
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
                        <Center><Text>{t('modifiers')}</Text></Center>
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
                        form.setFieldValue("modifiers", { ...field.value, order: itemIds })
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
                            modifier: { ...field.value.modifier, [id]: modifier }
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
                <Button type="submit" leftIcon={<FaSave />} isLoading={props.isSubmitting}>{t('save')}</Button>
              </Center>
            </Stack>
          </Form>
        )}
      </Formik>
    </Box >
  )
}
