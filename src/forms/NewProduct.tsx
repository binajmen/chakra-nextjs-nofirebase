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
    useToast,
    FormHelperText
} from '@chakra-ui/react'

import type { Product, Products } from '../types/product'

import { useStoreActions } from '../store/hooks'

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
    const vendorId = router.query.vendorId as string
    const categoryId = router.query.categoryId as string

    const createProduct = useStoreActions(actions => actions.products.createProduct)

    return (
        <Modal size="md" isOpen={modal.isOpen} onClose={modal.onClose}>
            <Formik
                initialValues={defaultValues}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    createProduct({ vendorId, categoryId, product: values })
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
