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
  useDisclosure
} from '@chakra-ui/react'
import { FaSave, FaPlus } from 'react-icons/fa'

import Button from '@/components/atoms/Button'
import List from './List'
import SelectionModal from './SelectionModal'
import { Loading, Error } from '@/components/Suspense'

import type { Catalog, Category } from '@/types/catalog'

export default function CatalogEdit() {
  const { t } = useTranslation('admin')
  const toast = useToast()
  const categoriesModal = useDisclosure()
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
            // categories
          })}
          onSubmit={(values, actions) => {
            const { name, description, categories } = values

            catalog.update({ name, description, categories })!
              .then(() => toast({
                description: t('changes-saved'),
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
                <Field name="categories">
                  {({ field, form, meta }: FieldProps) => (
                    <FormControl isInvalid={!!meta.error && !!meta.touched}>
                      <FormLabel htmlFor="description">
                        <Stack direction="row" spacing="6">
                          <Center><Text>{t('categories')}</Text></Center>
                          <Button
                            leftIcon={<FaPlus />}
                            size="sm"
                            onClick={categoriesModal.onOpen}>
                            {t('add')}
                          </Button>
                        </Stack>
                      </FormLabel>
                      <List
                        itemIds={field.value}
                        items={categories.data!}
                        keys={["name", "description"]}
                        onRemove={(itemId) => {
                          form.setFieldValue("categories", field.value.filter((id: string) => id !== itemId))
                        }}
                        onReorder={(itemIds) => {
                          form.setFieldValue("categories", itemIds)
                        }}
                        editPath={{
                          pathname: "/manage/[placeId]/categories/[categoryId]",
                          queryId: "categoryId"
                        }}
                      />
                      <SelectionModal
                        modal={categoriesModal}
                        title="Ajout d'options"
                        selected={field.value}
                        items={categories.data!}
                        keys={["name", "description"]}
                        add={(item) => {
                          form.setFieldValue("categories", [...field.value, item.id])
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
