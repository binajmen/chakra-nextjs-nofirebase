import * as React from 'react'
import * as Yup from 'yup'
import useTranslation from 'next-translate/useTranslation'
import { withAuthUser } from 'next-firebase-auth'
import { useRouter } from 'next/router'
import { Formik, Form, Field, FieldProps } from 'formik'
import { useDocument } from '@nandorojo/swr-firestore'

import {
  Box,
  Text,
  Center,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Input,
  Switch,
  Select,
  VStack,
  Progress,
  Heading,
  RadioGroup,
  Radio,
  Stack,
} from '@chakra-ui/react'

import { useStoreState, useStoreActions } from '@/store/hooks'
import { useStoreRehydrated } from 'easy-peasy'

import Layout from '@/components/layout/Layout'
import Button from '@/components/atoms/Button'
import DateField from '@/components/atoms/DateField'
import TimeIntervalField from '@/components/atoms/TimeIntervalField'

import type { Place } from '@/types/place'
import type { Address } from '@/types/customer'
import AddressField from '@/components/atoms/AddressField'

function CheckoutDelivery() {
  const { t } = useTranslation('checkout')
  const router = useRouter()

  const basket = useStoreActions(actions => actions.basket)
  const placeId = useStoreState(state => state.basket.placeId)

  const user = useStoreActions(actions => actions.user)
  const userId = useStoreState(state => state.user.id)
  const name = useStoreState(state => state.user.firstName)
  const email = useStoreState(state => state.user.email)
  const phone = useStoreState(state => state.user.phone)
  const userAddresses = useStoreState(state => state.user.addresses)

  const [addresses, setAddresses] = React.useState<Address[]>([])

  const address = useStoreState(state => state.basket.client.address)

  const isRehydrated = useStoreRehydrated()

  const place = useDocument<Place>(isRehydrated ? `places/${placeId}` : null)

  React.useEffect(() => {
    const unsubscribe = user.onUser()
    return () => unsubscribe()
  }, [])

  React.useEffect(() => {
    if (userId !== "")
      setAddresses(userAddresses)
  }, [userId])

  if (!isRehydrated || userId === "" || place.loading) {
    return <Progress size="xs" isIndeterminate />
  } else if (place.error) {
    return <Text>Error while loading place opening hours</Text>
  } else if (place.data) {
    return (
      <Layout
        subHeader="hide"
        metadata={{ title: "Myresto.brussels" }}
      >
        <Box w={["full", "sm"]} mx="auto">
          <Center><Heading my="6">{t('common:delivery')}</Heading></Center>
          <Formik
            initialValues={{
              name: name,
              email: email,
              phone: phone,
              address: addresses.length > 0 ? addresses[0] : address,
              comment: "",
              utensils: false,
              date: "",
              time: ""
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string().required(),
              email: Yup.string().email().required(),
              phone: Yup.string().required(),
              address: Yup.object().shape({
                address: Yup.string().required(),
                addressId: Yup.string().required(),
                lat: Yup.number().required(),
                lng: Yup.number().required(),
                geohash: Yup.string()
              }),
              comment: Yup.string(),
              utensils: Yup.boolean().required(),
              date: Yup.string().required(),
              time: Yup.string().required()
            })}
            onSubmit={(values) => {
              basket.setClient({
                id: userId,
                name: values.name,
                email: values.email,
                phone: values.phone,
                address: values.address
              })
              basket.setComment(values.comment)
              basket.setUtensils(values.utensils)
              basket.setDate(values.date)
              basket.setTime(values.time)

              router.push({
                pathname: "/checkout/payment"
              })
            }}
          >
            {(props) => (
              <Form>
                <Stack direction="column" spacing="6">
                  <Text>
                    {t('personal-info')}
                  </Text>
                  <Stack direction="column" spacing="6">
                    <Field name="name">
                      {({ field, form, meta }: FieldProps) => (
                        <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                          <FormLabel htmlFor="name">{t('name')}</FormLabel>
                          <Input {...field} id="name" placeholder="" />
                          <FormErrorMessage>{form.errors.name}</FormErrorMessage>
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
                    <Field name="phone">
                      {({ field, form, meta }: FieldProps) => (
                        <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                          <FormLabel htmlFor="phone">{t('phone')}</FormLabel>
                          <Input {...field} id="phone" placeholder="" />
                          <FormErrorMessage>{form.errors.phone}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="address">
                      {({ field, form, meta }: FieldProps) => (
                        <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                          <FormLabel htmlFor="address">{t('address')}</FormLabel>
                          <RadioGroup value={field.value.address}>
                            <Stack direction="column">
                              {addresses.map((address, index, array) =>
                                <React.Fragment key={index}>
                                  <Radio
                                    value={address.address}
                                    onChange={() => form.setFieldValue("address", address)}
                                  >
                                    <Box pl="3">
                                      {address.address.split(",").map(slice => <Text>{slice}</Text>)}
                                    </Box>
                                  </Radio>
                                  {index < array.length - 1 && <hr />}
                                </React.Fragment>
                              )}
                            </Stack>
                          </RadioGroup>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="address">
                      {({ field, form, meta }: FieldProps) => (
                        <FormControl isInvalid={!!meta.error && !!meta.touched}>
                          <AddressField
                            placeholder={t("common:add-an-address")}
                            noOptions={t("common:no-options")}
                            onAddress={(address) => {
                              setAddresses([...addresses, address])
                              form.setFieldValue("address", address)
                            }}
                          />
                          <FormErrorMessage>{form.errors.address}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="comment">
                      {({ field, form, meta }: FieldProps) => (
                        <FormControl isInvalid={!!meta.error && !!meta.touched}>
                          <FormLabel htmlFor="comment">{t('comment')}</FormLabel>
                          <Input {...field} id="comment" placeholder={t('optional')} />
                          <FormErrorMessage>{form.errors.comment}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="utensils">
                      {({ field }: FieldProps) => (
                        <FormControl display="flex" alignItems="center" pt="3">
                          <Switch {...field} isChecked={field.value} id="utensils" />
                          <FormLabel htmlFor="utensils" ml="3" mb="0">
                            {t('utensils')}
                          </FormLabel>
                        </FormControl>
                      )}
                    </Field>

                    <Heading size="md" pt="6" pb="3">{t('when-delivery')}</Heading>
                    <Field name="date">
                      {({ field, form, meta }: FieldProps) => (
                        <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                          <FormLabel htmlFor="date">{t('date')}</FormLabel>
                          <DateField
                            {...field}
                            id="date"
                            date={field.value}
                            schedule={place.data!.opening["collect"]}
                            interval={15}
                            setValue={(value) => form.setFieldValue("date", value)}
                          />
                          <FormErrorMessage>{form.errors.date}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="time">
                      {({ field, form, meta }: FieldProps) => (
                        <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                          <FormLabel htmlFor="time">{t('time')}</FormLabel>
                          <TimeIntervalField
                            {...field}
                            id="time"
                            date={props.values.date}
                            schedule={place.data!.opening["collect"]}
                            interval={15}
                            setValue={(value) => form.setFieldValue("time", value)}
                          />
                          <FormErrorMessage>{form.errors.time}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Stack>
                  <Button onClick={props.submitForm}>
                    {t('go-to-payment')}
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
      </Layout>
    )
  } else {
    return null
  }
}

export default withAuthUser()(CheckoutDelivery)

export function getStaticProps() { return { props: {} } }
