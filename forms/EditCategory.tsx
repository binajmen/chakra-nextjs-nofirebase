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
  Input,
  Button,
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

import type { Category } from '@/types/category'

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  desc: Yup.string().required()
})

export type EditCategoryProps = {
  modal: ReturnType<typeof useDisclosure>
  categoryId: string
}

export default function EditCategory({ modal, categoryId }: EditCategoryProps) {
  const { t } = useTranslation('common')
  const router = useRouter()
  const toast = useToast()
  const placeId = router.query.place as string

  const { data, update } = useDocument<Category>(`places/${placeId}/categories/${categoryId}`)

  if (!data) return <div>Loading..</div>

  const { id, exists, hasPendingWrites, __snapshot, ...category } = data

  return (
    <Modal size="md" isOpen={modal.isOpen} onClose={modal.onClose}>
      <Formik
        initialValues={category}
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
          modal.onClose()
        }}
      >
        {(props) => (
          <Form>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{t('edit')}</ModalHeader>
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
                  <Field name="desc">
                    {({ field, form, meta }: FieldProps) => (
                      <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                        <FormLabel htmlFor="desc">{t('manager:description')}</FormLabel>
                        <Input {...field} id="desc" placeholder="" />
                        <FormErrorMessage>{form.errors.desc}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Button
                  type="submit"
                  width="full"
                  color="gray.900"
                  colorScheme="primary"
                  isLoading={props.isSubmitting}
                >{t('save')}</Button>
              </ModalFooter>
            </ModalContent>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}