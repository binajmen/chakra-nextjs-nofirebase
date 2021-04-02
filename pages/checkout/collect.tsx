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
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Switch,
  Progress,
  Heading
} from '@chakra-ui/react'

import { useStoreState, useStoreActions } from '@/store/hooks'
import { useStoreRehydrated } from 'easy-peasy'

import Layout from '@/components/layout/Layout'

import Button from '@/components/atoms/Button'
import DateField from '@/components/atoms/DateField'
import TimeIntervalField from '@/components/atoms/TimeIntervalField'

import type { Place } from '@/types/place'

function CheckoutCollect() {
  const { t } = useTranslation('checkout')
  const router = useRouter()

  const basket = useStoreActions(actions => actions.basket)
  const placeId = useStoreState(state => state.basket.placeId)

  const user = useStoreActions(actions => actions.user)
  const userId = useStoreState(state => state.user.id)
  const name = useStoreState(state => state.user.firstName)
  const email = useStoreState(state => state.user.email)
  const phone = useStoreState(state => state.user.phone)

  const isRehydrated = useStoreRehydrated()

  const place = useDocument<Place>(isRehydrated ? `places/${placeId}` : null)

  React.useEffect(() => {
    const unsubscribe = user.onUser()
    return () => unsubscribe()
  }, [])

  if (!isRehydrated || userId === "" || place.loading) {
    return <div>
      <Progress size="xs" isIndeterminate />
      <Text>isRehydrated: {JSON.stringify(isRehydrated)}</Text>
      <Text>userId: {JSON.stringify(userId)}</Text>
      <Text>place.loading: {JSON.stringify(place.loading)}</Text>
    </div>
  } else if (place.error) {
    return <Text>Error while loading place opening hours</Text>
  } else if (place.data) {
    return (
      <Layout
        layout="checkout"
        metadata={{ title: "Myresto.brussels" }}
      >
        <Box w={["full", "sm"]} mx="auto">
          <Formik
            initialValues={{
              name: name,
              email: email,
              phone: phone,
              comment: "",
              utensils: false,
              date: "",
              time: ""
              // date: dayjs().format("YYYY-MM-DD"),
              // time: nextInterval(15).format("HH:mm")
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string().required(),
              email: Yup.string().email().required(),
              phone: Yup.string().required(),
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
                address: {
                  address: "",
                  addressId: "",
                  lat: 0,
                  lng: 0,
                  geohash: ""
                }
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
                <VStack spacing="5">
                  <Heading>{t('common:collect')}</Heading>
                  <Text>
                    {t('personal-info')}
                  </Text>
                  <VStack>
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
                    <Heading size="md" pt="6" pb="3">{t('when-collect')}</Heading>
                    <Field name="date">
                      {({ field, form, meta }: FieldProps) => (
                        <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                          <FormLabel htmlFor="date">{t('date')}</FormLabel>
                          <DateField
                            {...field}
                            id="date"
                            openingHours={place.data!.opening["collect"]}
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
                            openingHours={place.data!.opening["collect"]}
                            interval={15}
                            dateValue={props.values.date}
                            resetValue={(value) => form.setFieldValue("time", value)}
                          />
                          <FormErrorMessage>{form.errors.time}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </VStack>
                  <Button onClick={props.submitForm}>
                    {t('go-to-payment')}
                  </Button>
                </VStack>
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

export default withAuthUser()(CheckoutCollect)

export function getStaticProps() { return { props: {} } }
