import * as React from 'react'
import * as Yup from 'yup'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { useDocument, useCollection } from '@nandorojo/swr-firestore'
import { Formik, Form, Field, FieldProps } from 'formik'
dayjs.extend(customParseFormat)

import {
  Box,
  Stack,
  Center,
  Heading,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  ButtonGroup,
  Input,
  Select,
  useToast,
  useDisclosure
} from '@chakra-ui/react'
import { FaSave, FaPlus } from 'react-icons/fa'

import { Loading, Error } from '@/components/Suspense'
import Button from '@/components/atoms/Button'
import List from './List'
import SelectionModal from './SelectionModal'

import { stripDocument } from '@/helpers/index'

import type { Modifier, Product } from '@/types/catalog'

const initialValues: Modifier = {
  name: "",
  description: "",
  min: 0,
  max: 0,
  products: {
    order: [],
    product: {},
    price: {}
  },
  categoryIds: [],
  productIds: []
}

type ModifierFormProps = {
  modifier?: Modifier
  save: (modifier: Modifier) => Promise<any> | null
}

export default function ModifierForm({ modifier, save }: ModifierFormProps) {
  const { t } = useTranslation('admin')
  const productsModal = useDisclosure()
  const toast = useToast()
  const router = useRouter()
  const { placeId } = router.query

  const products = useCollection<Product>(productsModal.isOpen ? `places/${placeId}/products` : null)

  function isUnique(min: number, max: number) {
    return min === 0 && max === 1
  }
  function isMultiple(min: number, max: number, size: number) {
    return min === 0 && max > 1 && max === size
  }
  function isCustom(min: number, max: number, size: number) {
    return !isUnique(min, max) && !isMultiple(min, max, size)
  }

  return (
    <Box>
      <Heading mb="6">{t('modifier')} – {modifier ? modifier.name : t('new')}</Heading>
      <Formik
        initialValues={modifier ? modifier : initialValues}
        validationSchema={Yup.object({
          name: Yup.string().required(),
          description: Yup.string().required(),
          min: Yup.number().required().min(0)
            .test("less-than-max", "must be lower than max value", (value, context) => {
              return value! <= context.parent.max
            }),
          max: Yup.number().required().min(1)
            .test("max-options", "not enough options", (value, context) => {
              return value! <= context.parent.products.order.length
            }),
          // products
          // categoryIds
          // productIds
        })
        }
        onSubmit={(values, actions) => {
          const { name, description, min, max, products, categoryIds, productIds } = values

          save({ name, description, min, max, products, categoryIds, productIds })!
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
            pathname: "/manage/[placeId]/events",
            query: { placeId }
          })
        }}
      >
        {({ values, setFieldValue, isSubmitting }) => (
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
              <Stack direction="row" spacing="6">
                <Center><Text fontWeight="500">{t('rule')}</Text></Center>
                <ButtonGroup>
                  <Button
                    size="sm"
                    colorScheme={isUnique(values.min, values.max) ? "primary" : "gray"}
                    onClick={() => {
                      setFieldValue("min", 0)
                      setFieldValue("max", 1)
                    }}
                  >{t('single-choice')}</Button>
                  <Button
                    size="sm"
                    colorScheme={isMultiple(values.min, values.max, values.products.order.length) ? "primary" : "gray"}
                    onClick={() => {
                      setFieldValue("min", 0)
                      setFieldValue("max", values.products.order.length)
                    }}
                  >{t('multiple-choice')}</Button>
                  <Button
                    size="sm"
                    colorScheme={isCustom(values.min, values.max, values.products.order.length) ? "primary" : "gray"}
                  >{t('custom-choice')}</Button>
                </ButtonGroup>
              </Stack>
              <Box p="4" border="1px solid" borderColor="#E2E8F0" borderRadius="lg">
                <Stack direction="row">
                  <Field name="min">
                    {({ field, form, meta }: FieldProps) => (
                      <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                        <FormLabel htmlFor="min">{t('min')}</FormLabel>
                        <Input {...field} type="number" id="min" placeholder="" />
                        <FormErrorMessage>{form.errors.min}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="max">
                    {({ field, form, meta }: FieldProps) => (
                      <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                        <FormLabel htmlFor="max">{t('max')}</FormLabel>
                        <Input {...field} type="number" id="max" placeholder="" />
                        <FormErrorMessage>{form.errors.max}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Stack>
              </Box>
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
                      itemIds={field.value.order ?? []}
                      items={field.value.product ?? []}
                      keys={["name", "description"]}
                      price={field.value.price ?? []}
                      onPrice={(itemId, price) => {
                        form.setFieldValue("products", {
                          ...field.value,
                          price: { ...field.value.price, [itemId]: price }
                        })
                      }}
                      onRemove={(itemId) => {
                        const newOrder = field.value.order.filter((id: string) => id !== itemId)
                        const newProduts = field.value.product
                        delete newProduts[itemId]
                        const newPrice = field.value.price
                        delete newPrice[itemId]
                        form.setFieldValue("products", {
                          order: newOrder,
                          product: newProduts,
                          price: newPrice
                        })
                      }}
                      onReorder={(itemIds) => {
                        form.setFieldValue("products", { ...field.value, order: itemIds })
                      }}
                      editPath={{
                        pathname: "/manage/[placeId]/products/[productId]",
                        queryId: "productId"
                      }}
                    />
                    <SelectionModal
                      modal={productsModal}
                      title="Ajout d'événements"
                      selected={field.value.order ?? []}
                      items={products.data! ?? []}
                      keys={["name", "description"]}
                      add={(item) => {
                        const { id, ...product } = stripDocument(item)
                        if ("order" in field.value && "product" in field.value && "price" in field.value) {
                          form.setFieldValue("products", {
                            order: [...field.value.order, id],
                            product: { ...field.value.product, [id]: product },
                            price: { ...field.value.price, [id]: product.price }
                          })
                        } else {
                          form.setFieldValue("products", {
                            order: [id],
                            product: { [id]: product },
                            price: { [id]: product.price }
                          })
                        }
                      }} />
                    <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Center>
                <Button type="submit" leftIcon={<FaSave />} isLoading={isSubmitting}>{t('save')}</Button>
              </Center>
            </Stack>
          </Form>
        )}
      </Formik>
    </Box >
  )
}
