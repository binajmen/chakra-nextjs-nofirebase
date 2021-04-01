import * as React from 'react'
import * as Yup from 'yup'
import useTranslation from 'next-translate/useTranslation'
import dayjs from 'dayjs'
import { withAuthUser } from 'next-firebase-auth'
import { useRouter } from 'next/router'
import { Formik, Form, Field, FieldProps } from 'formik'

import {
  Box,
  Text,
  VStack,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Input,
  Progress,
  Heading
} from '@chakra-ui/react'

import { useStoreState, useStoreActions } from '@/store/hooks'
import { useStoreRehydrated } from 'easy-peasy'

import { nextInterval } from '@/helpers/hours'

import Layout from '@/components/layout/Layout'

import Button from '@/components/atoms/Button'
import DateField from '@/components/atoms/DateField'
import TimeIntervalField from '@/components/atoms/TimeIntervalField'

function CheckoutCollect() {
  const { t } = useTranslation('checkout')
  const router = useRouter()

  const name = useStoreState(state => state.basket.name)
  const email = useStoreState(state => state.basket.email)
  const phone = useStoreState(state => state.basket.phone)
  const basket = useStoreActions(actions => actions.basket)
  const isRehydrated = useStoreRehydrated()

  if (!isRehydrated) {
    return <Progress size="xs" isIndeterminate />
  }

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
            date: dayjs().format("YYYY-MM-DD"),
            time: nextInterval().format("HH:mm")
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            phone: Yup.string().required(),
            date: Yup.string().required(),
            time: Yup.string().required()
          })}
          onSubmit={(values) => {
            basket.setName(values.name)
            basket.setEmail(values.email)
            basket.setPhone(values.phone)
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
                  {t('choose-collect-time')}
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
                        <FormHelperText>{t('why-email')}</FormHelperText>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="phone">
                    {({ field, form, meta }: FieldProps) => (
                      <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                        <FormLabel htmlFor="phone">{t('phone')}</FormLabel>
                        <Input {...field} id="phone" placeholder="" />
                        <FormErrorMessage>{form.errors.phone}</FormErrorMessage>
                        <FormHelperText>{t('why-phone')}</FormHelperText>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="date">
                    {({ field, form, meta }: FieldProps) => (
                      <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                        <FormLabel htmlFor="date">{t('date')}</FormLabel>
                        <DateField {...field} id="date" />
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
                          opening={["0800", "1200", "1400", "1800"]}
                          isToday={dayjs().isSame(props.values.date, 'day')}
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
}

export default withAuthUser()(CheckoutCollect)

export function getStaticProps() { return { props: {} } }
