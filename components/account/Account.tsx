import * as React from "react"
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
  Button as CButton,
  Switch,
  VStack,
  Center,
  useToast
} from '@chakra-ui/react'
import { FaTrash, FaSave } from 'react-icons/fa'

import firebase from "@/lib/firebase/client"
import Button from '@/components/atoms/Button'
import AddressField from '@/components/atoms/AddressField'
import LoadingOverlay from '@/components/atoms/LoadingOverlay'

import type { CustomerProfile } from '@/types/customer'

export default function AccountAuthed() {
  const authUser = useAuthUser()

  const user = useDocument<CustomerProfile>(authUser.id ? `customers/${authUser.id}` : null)

  if (user.loading) {
    return <LoadingOverlay />
  } else if (user.error) {
    return <Text>Error: {JSON.stringify(user.error)}</Text>
  } else if (user.data) {
    return (
      <Stack direction="column">
        <Profile user={user.data} update={user.update} />
        <Box my="6" />
        <Addresses user={user.data} update={user.update} />
        {/* <AddressField /> */}
      </Stack>
    )
  } else {
    return <Text>.</Text>
  }
}

type AccountProps = {
  user: CustomerProfile
  update: (data: any) => Promise<void> | null
}

function Profile({ user, update }: AccountProps) {
  const { t } = useTranslation('common')
  const toast = useToast()

  const { firstName, lastName, phone, email, newsletter } = user

  return (
    <Box>
      <Center><Heading my="6">{t("my-account")}</Heading></Center>
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
              <Center pt="6">
                <Button
                  type="submit"
                  leftIcon={<FaSave />}
                  isLoading={props.isSubmitting}
                >{t('save')}</Button>
              </Center>
            </VStack>
          </Form>
        )}
      </Formik>
    </Box >
  )
}

function Addresses({ user, update }: AccountProps) {
  const { t } = useTranslation('common')
  const toast = useToast()

  const { addresses } = user

  return (
    <Box>
      <Heading size="lg" mb="3">Adresses</Heading>
      <Text fontSize="sm" mb="6">Sauvegardez vos adresses afin de les retrouver rapidement lors de vos prochaines commandes.</Text>
      <Formik
        initialValues={{ addresses }}
        validationSchema={Yup.object().shape({
          addresses: Yup.array().of(Yup.object().shape({
            address: Yup.string().required(),
            addressId: Yup.string().required(),
            geohash: Yup.string(),
            lat: Yup.number().required(),
            lng: Yup.number().required()
          })).required()
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
              {props.values.addresses?.map((address, index) => (
                <Field key={index} name={`addresses-${index}`}>
                  {({ field, form, meta }: FieldProps) => (
                    <FormControl isInvalid={!!meta.error && !!meta.touched}>
                      <Flex justify="space-between" mb="2" alignItems="center">
                        <FormLabel htmlFor={`addresses-${index}`} mb="0">
                          {t('address')} #{index + 1}
                        </FormLabel>

                        <CButton
                          size="sm"
                          leftIcon={<FaTrash />}
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => {
                            form.setFieldValue("addresses", props.values.addresses.filter((_, i) => index !== i))
                          }}
                        >{t("delete")}</CButton>
                      </Flex>
                      <Box>
                        {address.address.split(",").map((slice: string) => <Text>{slice}</Text>)}
                      </Box>
                    </FormControl>
                  )}
                </Field>
              ))}
              <Box pt="6" w="full">
                <FormControl>
                  <FormLabel>Ajouter une adresse</FormLabel>
                  <AddressField
                    placeholder={t("common:add-an-address")}
                    noOptions={t("common:no-options")}
                    onAddress={(address) => {
                      props.setFieldValue("addresses", [...props.values.addresses, address])
                    }}
                  />
                </FormControl>
              </Box>
              <Center pt="6">
                <Button
                  type="submit"
                  leftIcon={<FaSave />}
                  isLoading={props.isSubmitting}
                >{t('save')}</Button>
              </Center>
            </VStack>
          </Form>
        )}
      </Formik>
    </Box >
  )
}
