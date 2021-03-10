import * as React from 'react'
import { useRouter } from 'next/router'
import * as Yup from 'yup'
import { Formik, Form, Field, FieldProps } from 'formik'
import useTranslation from 'next-translate/useTranslation'
import { useDocument } from '@nandorojo/swr-firestore'

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
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
  useToast
} from '@chakra-ui/react'

import type { Document } from '@nandorojo/swr-firestore'
import type { Product } from '@/types/product'

import { useStoreState, useStoreActions } from '@/store/hooks'

import CentsPriceField from '@/components/atoms/CentsPriceField'

export type EditProductProps = {
  modal: ReturnType<typeof useDisclosure>
  productId: string
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  desc: Yup.string().required()
})

const defaultValues: Product = {
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

export default function EditProduct({ modal, productId }: EditProductProps) {
  const { t } = useTranslation('common')
  const router = useRouter()
  const toast = useToast()
  const placeId = router.query.place as string

  const { data, update } = useDocument<Product>(`places/${placeId}/products/${productId}`)

  if (!data) return <div>Loading..</div>

  const { id, exists, hasPendingWrites, __snapshot, ...product } = data

  return (
    <Modal size="md" isOpen={modal.isOpen} onClose={modal.onClose}>
      <Formik
        initialValues={{ ...defaultValues, ...product }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          update(values)!
            .then(() => toast({
              description: t('manager:changes-saved'),
              status: "success"
            }))
            .catch((error) => toast({
              description: error.message,
              status: "error"
            }))
          // updateProduct({ placeId, productId, product: values })
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
