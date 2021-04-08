import * as React from 'react'
import * as Yup from 'yup'
import useTranslation from 'next-translate/useTranslation'
import { AuthAction, useAuthUser, withAuthUser } from 'next-firebase-auth'
import { useRouter } from 'next/router'
import { Formik, Form, Field, FieldProps } from 'formik'
import { useDocument } from '@nandorojo/swr-firestore'

import {
  Box,
  Text,
  Center,
  Stack,
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
import LoadingOverlay from '@/components/atoms/LoadingOverlay'

import type { Place } from '@/types/place'
import dayjs from 'functions/node_modules/dayjs'

function CheckoutCollect() {
  const { t } = useTranslation('checkout')
  const router = useRouter()
  const authUser = useAuthUser()

  const basket = useStoreActions(actions => actions.basket)
  const placeId = useStoreState(state => state.basket.placeId)

  const user = useStoreActions(actions => actions.user)
  const userId = useStoreState(state => state.user.id)
  const name = useStoreState(state => state.user.firstName)
  const email = useStoreState(state => state.user.email)
  const phone = useStoreState(state => state.user.phone)

  const date = useStoreState(state => state.order.date)
  const time = useStoreState(state => state.order.time)

  const isRehydrated = useStoreRehydrated()

  const place = useDocument<Place>(isRehydrated ? `places/${placeId}` : null)

  React.useEffect(() => {
    if (authUser.id === null) {
      router.push({
        pathname: "/account/signin",
        query: { next: router.asPath }
      })
    } else {
      console.log("authUser ok:", authUser.id)
    }
  }, [authUser])

  React.useEffect(() => {
    const unsubscribe = user.onUser()
    console.log("onUser ok:", userId)
    return () => unsubscribe()
  }, [])

  if (!isRehydrated || authUser.id === null || userId === "" || place.loading) {
    return <div>
      <LoadingOverlay />
      <Text>isRehydrated: {JSON.stringify(isRehydrated)}</Text>
      <Text>userId: {JSON.stringify(userId)}</Text>
      <Text>place.loading: {JSON.stringify(place.loading)}</Text>
    </div>
  } else if (place.error) {
    return <div>
      <LoadingOverlay />
      <Progress size="xs" isIndeterminate />
      <Text>isRehydrated: {JSON.stringify(isRehydrated)}</Text>
      <Text>userId: {JSON.stringify(userId)}</Text>
      <Text>placeId: {JSON.stringify(placeId)}</Text>
      <Text>place.loading: {JSON.stringify(place.loading)}</Text>
      <Text>place.loading: {JSON.stringify(place)}</Text>
    </div>
  } else if (place.data) {
    return (
      <Layout
        subHeader="hide"
        metadata={{ title: "Myresto.brussels" }}
      >
        <Box w={["full", "md"]} mx="auto" p="2">
          <Center><Heading my="6">{t('common:collect')}</Heading></Center>
          <Formik
            initialValues={{
              name: name,
              email: email,
              phone: phone,
              comment: "",
              utensils: false,
              date: date,
              time: time
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

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  LoaderComponent: () => <LoadingOverlay />,
})(CheckoutCollect)

export function getStaticProps() { return { props: {} } }
