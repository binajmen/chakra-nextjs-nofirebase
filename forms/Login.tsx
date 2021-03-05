import * as React from 'react'
import * as Yup from 'yup'
import { Formik, Form, Field, FieldProps } from 'formik'

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
    VStack
} from '@chakra-ui/react'

export type LoginProps = {
    modal: ReturnType<typeof useDisclosure>
}

const validationSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required()
})

export default function Login({ modal }: LoginProps) {
    const pwd = useDisclosure()

    return (
        <Modal size="md" isOpen={modal.isOpen} onClose={modal.onClose}>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={(values, actions) => {
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2))
                        actions.setSubmitting(false)
                    }, 1000)
                }}
            >
                {(props) => (
                    <Form>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Login</ModalHeader>
                            <ModalCloseButton />

                            <ModalBody>
                                <Field name="email">
                                    {({ field, form, meta }: FieldProps) => (
                                        <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                                            <FormLabel htmlFor="email">Email</FormLabel>
                                            <Input {...field} id="email" placeholder="" />
                                            <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name="password">
                                    {({ field, form, meta }: FieldProps) => (
                                        <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired mt={6}>
                                            <FormLabel htmlFor="password">Password</FormLabel>
                                            <InputGroup>
                                                <Input {...field} id="password" placeholder=""
                                                    type={pwd.isOpen ? 'text' : 'password'}
                                                    pr="4.5rem"
                                                />
                                                <InputRightElement width="4.5rem">
                                                    <Button h="1.75rem" size="sm" onClick={pwd.onToggle}>
                                                        {pwd.isOpen ? "Hide" : "Show"}
                                                    </Button>
                                                </InputRightElement>
                                            </InputGroup>
                                            <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                            </ModalBody>

                            <ModalFooter>
                                <VStack width="full">
                                    <Button
                                        type="submit"
                                        width="full"
                                        colorScheme="primary"
                                        isLoading={props.isSubmitting}
                                    >Sign In</Button>
                                    <Button variant="link">Forgot your password?</Button>
                                </VStack>
                            </ModalFooter>
                        </ModalContent>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}
