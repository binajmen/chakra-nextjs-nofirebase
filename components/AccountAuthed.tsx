import * as Yup from 'yup'
import useTranslation from 'next-translate/useTranslation'
import { useAuthUser } from 'next-firebase-auth'
import { Formik, Form, Field, FieldProps } from 'formik'
import { useDocument } from '@nandorojo/swr-firestore'

import {
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  IconButton,
  Switch,
  VStack,
  Center,
  useToast
} from '@chakra-ui/react'
import { FaPlusCircle, FaTrash } from 'react-icons/fa'

import Button from '@/components/atoms/Button'
import AddressField from '@/components/atoms/AddressField'

import type { CustomerProfile } from '@/types/customer'

export default function AccountAuthed() {
  const authUser = useAuthUser()

  return (
    <Stack direction="column">
      <Identification userId={authUser.id as string} />
      <Box my="6" />
      <Addresses userId={authUser.id as string} />
      {/* <AddressField /> */}
    </Stack>
  )
}

type AccountProps = {
  userId: string
}

function Identification({ userId }: AccountProps) {
  const toast = useToast()
  const { t } = useTranslation('common')
  const { data: profile, loading, update } = useDocument<CustomerProfile>(`customers/${userId}`)

  if (loading) {
    return (<Text>Loading..</Text>)
  }

  if (profile) {
    const { firstName, lastName, phone, email, newsletter } = profile

    return (
      <Box>
        <Heading size="lg" mb="3">Profil</Heading>
        <Text fontSize="sm" mb="6">Sauvegardez vos informations de base afin de gagner du temps lors de vos prochaines commandes.</Text>
        <Formik
          initialValues={{ firstName, lastName, phone, email, newsletter }}
          validationSchema={Yup.object().shape({
            firstName: Yup.string().required(),
            lastName: Yup.string().required(),
            phone: Yup.string().required(),
            email: Yup.string().email().required(),
            newsletter: Yup.boolean().required()
          })}
          onSubmit={(values, actions) => {
            update(values)!
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
              <VStack spacing={3}>
                <Field name="firstName">
                  {({ field, form, meta }: FieldProps) => (
                    <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                      <FormLabel htmlFor="firstName">{t('firstName')}</FormLabel>
                      <Input {...field} id="firstName" placeholder="" />
                      <FormErrorMessage>{form.errors.firstName}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="lastName">
                  {({ field, form, meta }: FieldProps) => (
                    <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                      <FormLabel htmlFor="lastName">{t('lastName')}</FormLabel>
                      <Input {...field} id="lastName" placeholder="" />
                      <FormErrorMessage>{form.errors.lastName}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="phone">
                  {({ field, form, meta }: FieldProps) => (
                    <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                      <FormLabel htmlFor="phone">{t('phone')}</FormLabel>
                      <Input {...field} id="phone" placeholder="" />
                      <FormErrorMessage>{form.errors.phone}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="email">
                  {({ field, form, meta }: FieldProps) => (
                    <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                      <FormLabel htmlFor="email">{t('email')}</FormLabel>
                      <Input {...field} id="email" placeholder="" />
                      <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="newsletter">
                  {({ field }: FieldProps) => (
                    <FormControl display="flex" alignItems="center">
                      <Switch {...field} isChecked={field.value} id="newsletter" />
                      <FormLabel htmlFor="newsletter" ml="3" mb="0">
                        M'envoyer des nouvelles de temps en temps ? Avec plaisir !
                      </FormLabel>
                    </FormControl>
                  )}
                </Field>
                <Box w="full" textAlign="right">
                  <Button
                    type="submit"
                    size="sm"
                    isLoading={props.isSubmitting}
                  >{t('save')}</Button>
                </Box>
              </VStack>
            </Form>
          )}
        </Formik>
      </Box >
    )
  }

  return null
}

function Addresses({ userId }: AccountProps) {
  const toast = useToast()
  const { t } = useTranslation('common')
  const { data: profile, loading, update } = useDocument<CustomerProfile>(`customers/${userId}`)

  if (loading) {
    return (<Text>Loading..</Text>)
  }

  if (profile) {
    const { addresses } = profile

    return (
      <Box>
        <Heading size="lg" mb="3">Adresses</Heading>
        <Text fontSize="sm" mb="6">Sauvegardez vos adresses afin de les retrouver rapidement lors de vos prochaines commandes.</Text>
        <Formik
          initialValues={{ addresses }}
          validationSchema={Yup.object().shape({
            addresses: Yup.array().of(Yup.string().required("required field")),
          })}
          onSubmit={(values, actions) => {
            update(values)!
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
              <VStack spacing={3}>
                {props.values.addresses?.map((_, index) => (
                  <Field key={index} name={`addresses[${index}]`}>
                    {({ field, form, meta }: FieldProps) => (
                      <FormControl isInvalid={!!meta.error && !!meta.touched}>
                        <Flex justify="space-between" mb="2">
                          <Center><FormLabel htmlFor={`addresses[${index}]`} mb="0">{t('address')} #{index + 1}</FormLabel></Center>
                          <Box>
                            <IconButton hidden={index !== props.values.addresses.length - 1} size="sm" aria-label="add" icon={<FaPlusCircle />} variant="ghost" colorScheme="gray" onClick={() => {
                              form.setFieldValue("addresses", [...props.values.addresses, ""])
                            }} />
                            <IconButton size="sm" aria-label="delete" icon={<FaTrash />} colorScheme="red" variant="ghost" onClick={() => {
                              form.setFieldValue("addresses", props.values.addresses.filter((_, i) => index !== i))
                            }} />
                          </Box>
                        </Flex>
                        <Input {...field} id={`addresses[${index}]`} placeholder="" />
                      </FormControl>
                    )}
                  </Field>
                ))}
                <Box hidden={props.values.addresses?.length !== 0} w="full" textAlign="left">
                  <Button size="sm" aria-label="add" leftIcon={<FaPlusCircle />} variant="ghost" colorScheme="gray" onClick={() => {
                    props.setFieldValue("addresses", [...props.values.addresses, ""])
                  }}>{t('add')}</Button>
                </Box>
                <Box w="full" textAlign="right">
                  <Button
                    type="submit"
                    size="sm"
                    isLoading={props.isSubmitting}
                  >{t('save')}</Button>
                </Box>
              </VStack>
            </Form>
          )}
        </Formik>
      </Box >
    )
  }

  return null
}
