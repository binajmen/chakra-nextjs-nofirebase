import * as React from 'react'
import { useRouter } from 'next/router'
import * as Yup from 'yup'
import { Formik, Form, Field, FieldProps } from 'formik'
import useTranslation from 'next-translate/useTranslation'
import { useDocument } from '@nandorojo/swr-firestore'
import fuego from '@/lib/firebase/fuego'

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  InputGroup,
  InputRightElement,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  useToast,
  FormHelperText
} from '@chakra-ui/react'

import { generateId } from '@/helpers/index'

import CentsPriceField from '@/components/atoms/CentsPriceField'

import type { Category } from '@/types/category'
import type { Product } from '@/types/product'

export type NewProductProps = {
  modal: ReturnType<typeof useDisclosure>
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  longName: Yup.string().required(),
  desc: Yup.string().required(),
  price: Yup.number().required(),
  tax: Yup.number().required(),
  size: Yup.string(),
})

const defaultValues: Product = {
  id: "WILL_BE_DELETED",
  available: true,
  name: "",
  longName: "",
  desc: "",
  price: 0,
  tax: 0,
  size: "",
  categoryIds: [],
  type: "product"
}

export default function NewProduct({ modal }: NewProductProps) {
  const { t } = useTranslation('common')
  const router = useRouter()
  const toast = useToast()
  const place = router.query.place as string
  const categoryId = router.query.category as string

  const { data: category, update: updateCategory } = useDocument<Category>(`places/${place}/categories/${categoryId}`)

  return (
    <Modal size="md" isOpen={modal.isOpen} onClose={modal.onClose}>
      <Formik
        initialValues={defaultValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const { id, ...rest } = values
          const genId = generateId(rest.name)
          const product = {
            ...defaultValues,
            ...rest,
            categoryIds: [categoryId]
          }

          fuego.db.doc(`places/${place}/products/${genId}`)
            .set(product, { merge: true })
            .then(() => toast({
              description: t('manager:changes-saved'),
              status: "success"
            }))
            .then(() => updateCategory({ items: [...category!.items, genId] }))
            .catch((error) => toast({
              description: error.message,
              status: "error"
            }))

          modal.onClose()
        }}
      >
        {(props) => (
          <Form>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{t('new')}</ModalHeader>
              <ModalCloseButton />

              <ModalBody>
                <VStack spacing={3}>
                  <Field name="name">
                    {({ field, form, meta }: FieldProps) => (
                      <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                        <FormLabel htmlFor="name">{t('manager:name')}</FormLabel>
                        <Input {...field} id="name" placeholder="" />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="longName">
                    {({ field, form, meta }: FieldProps) => (
                      <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                        <FormLabel htmlFor="longName">{t('manager:longName')}</FormLabel>
                        <Input {...field} id="longName" placeholder="" />
                        <FormErrorMessage>{form.errors.longName}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="desc">
                    {({ field, form, meta }: FieldProps) => (
                      <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                        <FormLabel htmlFor="desc">{t('manager:description')}</FormLabel>
                        <Input {...field} id="desc" placeholder="" />
                        <FormErrorMessage>{form.errors.desc}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="price">
                    {(formikProps: FieldProps) => (
                      <CentsPriceField
                        {...formikProps}
                        id="price"
                        label={t('manager:price')}
                        helperText="100 = 1€"
                      />
                    )}
                  </Field>
                  <Field name="tax">
                    {({ field, form, meta }: FieldProps) => (
                      <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                        <FormLabel htmlFor="tax">{t('manager:tax')}</FormLabel>
                        <Input {...field} id="tax" placeholder="6, 12, 21" />
                        <FormErrorMessage>{form.errors.tax}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="size">
                    {({ field, form, meta }: FieldProps) => (
                      <FormControl isInvalid={!!meta.error && !!meta.touched}>
                        <FormLabel htmlFor="size">{t('manager:size')}</FormLabel>
                        <Input {...field} id="size" placeholder="25cl, bouteille, ..." />
                        <FormErrorMessage>{form.errors.size}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Button
                  type="submit"
                  // width="full"
                  color="gray.900"
                  colorScheme="primary"
                  isLoading={props.isSubmitting}
                >{t('save')}</Button>
              </ModalFooter>
            </ModalContent>
          </Form>
        )}
      </Formik>
    </Modal >
  )
}
