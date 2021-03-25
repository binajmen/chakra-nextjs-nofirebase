import * as React from 'react'
import * as Yup from 'yup'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { useDocument, useCollection } from '@nandorojo/swr-firestore'
import { Formik, Form, Field, FieldProps } from 'formik'

import {
  Box,
  Stack,
  Center,
  Heading,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  useToast,
  useDisclosure,
} from '@chakra-ui/react'
import { FaSave, FaPlus } from 'react-icons/fa'

import { Loading, Error } from '@/components/Suspense'
import Button from '@/components/atoms/Button'
import List from './List'
import SelectionModal from './SelectionModal'

import { stripDocument } from '@/helpers/index'

import type { Category, Product, Event, Modifier } from '@/types/catalog'

const initialValues: Category = {
  available: true,
  name: "",
  description: "",
  products: [],
  events: {
    order: [],
    event: {}
  },
  modifiers: {
    order: [],
    modifier: {}
  }
}

type CategoryFormProps = {
  category?: Category
  save: (category: Category) => Promise<any> | null
}

export default function CategoryForm({ category, save }: CategoryFormProps) {
  const { t } = useTranslation('admin')
  const productsModal = useDisclosure()
  const eventsModal = useDisclosure()
  const modifiersModal = useDisclosure()
  const toast = useToast()
  const router = useRouter()
  const { placeId } = router.query

  const products = useCollection<Product>(`places/${placeId}/products`)
  const events = useCollection<Event>(eventsModal.isOpen ? `places/${placeId}/events` : null)
  const modifiers = useCollection<Modifier>(modifiersModal.isOpen ? `places/${placeId}/modifiers` : null)

  if (products.loading) {
    return <Loading />
  } else if (products.error) {
    return <Error error={products.error} />
  } else if (products.data) {
    return (
      <Box>
        <Heading mb="6">{t('category')} – {category ? category.name : t('new')}</Heading>
        <Formik
          initialValues={category ? category : initialValues}
          validationSchema={Yup.object({
            // available
            name: Yup.string().required(),
            description: Yup.string().required(),
            products: Yup.array().of(Yup.string())
            // events
            // modifiers
          })}
          onSubmit={(values, actions) => {
            const { available, name, description, products, events, modifiers } = values

            save({ available, name, description, products, events, modifiers })!
              .then(() => toast({
                description: t('changes-saved'),
                status: "success"
              }))
              .catch((error) => toast({
                description: error.message,
                status: "error"
              }))

            actions.setSubmitting(false)

            router.push({
              pathname: "/manage/[placeId]/categories",
              query: { placeId }
            })
          }}
        >
          {(props) => (
            <Form>
              <Stack direction="column" spacing="6">
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
                <Field name="products">
                  {({ field, form, meta }: FieldProps) => (
                    <FormControl isInvalid={!!meta.error && !!meta.touched}>
                      <FormLabel htmlFor="description">
                        <Stack direction="row" spacing="6">
                          <Center><Text>{t('products')}</Text></Center>
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
                        keys={["name", "description", "price"]}
                        transform={{
                          "price": (value) => `${value / 100}€`
                        }}
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
                  <Button type="submit" leftIcon={<FaSave />} isLoading={props.isSubmitting}>{t('save')}</Button>
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
