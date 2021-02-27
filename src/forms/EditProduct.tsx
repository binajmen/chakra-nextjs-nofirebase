import * as React from 'react'
import produce from 'immer'
import { useRouter } from 'next/router'
import * as Yup from 'yup'
import { Formik, Form, Field, FieldProps } from 'formik'
import useTranslation from 'next-translate/useTranslation'

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
    useToast
} from '@chakra-ui/react'

import { updateProduct } from '../firebase/helpers/products'

import type { Product, Products } from '../types/product'

export type EditProductProps = {
    modal: ReturnType<typeof useDisclosure>
    product: Product
    setProducts: React.Dispatch<React.SetStateAction<Products>>
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required(),
    desc: Yup.string().required()
})

export default function EditProduct({ modal, product, setProducts }: EditProductProps) {
    const { t } = useTranslation('common')
    const router = useRouter()
    const toast = useToast()
    const vendorId = router.query.vendorId as string
    const productId = product.id!

    return (
        <Modal size="md" isOpen={modal.isOpen} onClose={modal.onClose}>
            <Formik
                initialValues={product}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    updateProduct(vendorId, values)
                        .then(() => {
                            setProducts(produce(draft => { draft[productId] = { ...draft[productId], ...values } }))
                            toast({
                                description: t('vendor:changes-saved'),
                                status: "success"
                            })
                        })
                        .catch(error => {
                            toast({
                                description: error,
                                status: "error"
                            })
                        })
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
                                                <FormLabel htmlFor="name">{t('vendor:name')}</FormLabel>
                                                <Input {...field} id="name" placeholder="" />
                                                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="desc">
                                        {({ field, form, meta }: FieldProps) => (
                                            <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                                                <FormLabel htmlFor="desc">{t('vendor:description')}</FormLabel>
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
