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

import { generateId } from '@/helpers/index'

import type { Category, CategoryMeta } from '@/types/category'

export type NewCategoryProps = {
  modal: ReturnType<typeof useDisclosure>
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  desc: Yup.string().required()
})

const defaultValues: Category = {
  name: "",
  desc: "",
  available: true,
  events: {},
  items: [],
  modifiers: {}
}

export default function NewCategory({ modal }: NewCategoryProps) {
  const { t } = useTranslation('common')
  const toast = useToast()
  const router = useRouter()
  const place = router.query.place

  const { data: meta, update: updateMeta } = useDocument<CategoryMeta>(`places/${place}/categories/_meta_`)

  return (
    <Modal size="md" isOpen={modal.isOpen} onClose={modal.onClose}>
      <Formik
        initialValues={{ name: '', desc: '' }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const genId = generateId(values.name)
          fuego.db.doc(`places/${place}/categories/${genId}`)
            .set({ ...defaultValues, ...values }, { merge: true })
            .then(() => toast({
              description: t('manager:changes-saved'),
              status: "success"
            }))
            .catch((error) => toast({
              description: error.message,
              status: "error"
            }))
          updateMeta({ order: [...meta!.order, genId] })
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
    </Modal >
  )
}
