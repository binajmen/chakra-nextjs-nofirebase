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

import type { Product, Products } from '../types/product'

import { useStoreState, useStoreActions } from '../store/hooks'

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
    const vendorId = router.query.vendorId as string
    const categoryId = router.query.categoryId as string

    const products = useStoreState(state => state.products.list)
    const updateProduct = useStoreActions(actions => actions.products.updateProduct)

    return (
        <Modal size="md" isOpen={modal.isOpen} onClose={modal.onClose}>
            <Formik
                initialValues={{ ...defaultValues, ...products[productId] }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    updateProduct({ vendorId, productId, product: values })
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
                                                <FormLabel htmlFor="name">{t('vendor:name')}</FormLabel>
                                                <Input {...field} id="name" placeholder="" />
                                                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="longName">
                                        {({ field, form, meta }: FieldProps) => (
                                            <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                                                <FormLabel htmlFor="longName">{t('vendor:longName')}</FormLabel>
                                                <Input {...field} id="longName" placeholder="" />
                                                <FormErrorMessage>{form.errors.longName}</FormErrorMessage>
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
                                    <Field name="price">
                                        {({ field, form, meta }: FieldProps) => (
                                            <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                                                <FormLabel htmlFor="price">{t('vendor:price')}</FormLabel>
                                                <Input {...field} id="price" placeholder="" />
                                                <FormHelperText>Eurocents: 100 = 1€</FormHelperText>
                                                <FormErrorMessage>{form.errors.price}</FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="tax">
                                        {({ field, form, meta }: FieldProps) => (
                                            <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                                                <FormLabel htmlFor="tax">{t('vendor:tax')}</FormLabel>
                                                <Input {...field} id="tax" placeholder="6, 12, 21" />
                                                <FormErrorMessage>{form.errors.tax}</FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="size">
                                        {({ field, form, meta }: FieldProps) => (
                                            <FormControl isInvalid={!!meta.error && !!meta.touched}>
                                                <FormLabel htmlFor="size">{t('vendor:size')}</FormLabel>
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
