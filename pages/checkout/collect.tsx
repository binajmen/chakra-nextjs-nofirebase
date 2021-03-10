import * as React from 'react'
import { useRouter } from 'next/router'
import * as Yup from 'yup'
import { Formik, Form, Field, FieldProps } from 'formik'
import useTranslation from 'next-translate/useTranslation'
import dayjs from 'dayjs'

import {
  Box,
  Text,
  VStack,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Input,
  Progress
} from '@chakra-ui/react'

import { useStoreState, useStoreActions } from '@/store/hooks'
import { useStoreRehydrated } from 'easy-peasy'

import { nextInterval } from '@/helpers/hours'

import Wrapper from '@/layout/Wrapper'
import Footer from '@/layout/client/Footer'
import Button from '@/components/atoms/Button'
import DateField from '@/components/atoms/DateField'
import TimeIntervalField from '@/components/atoms/TimeIntervalField'

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  date: Yup.string().required(),
  time: Yup.string().required()
})

function CheckoutCollect() {
  const { t } = useTranslation('checkout')
  const router = useRouter()

  const email = useStoreState(state => state.basket.email)
  const basket = useStoreActions(actions => actions.basket)
  const isRehydrated = useStoreRehydrated()



  const [date, setDate] = React.useState<string>(dayjs().format("YYYY-MM-DD"))
  const [time, setTime] = React.useState<string>(nextInterval().format("HH:mm"))

  const isToday = dayjs().isSame(date, 'day')

  // TODO: reflect opening hours in time selection
  //       setTime to first slot if incorrect
  React.useEffect(() => {
    basket.setDate(date)
    if (isToday)
      basket.setTime(nextInterval().format("HH:mm"))
  }, [date])

  React.useEffect(() => {
    basket.setTime(time)
  }, [time])




  if (!isRehydrated) {
    return <Progress size="xs" isIndeterminate />
  }

  return (
    <Wrapper
      title="Order.brussels"
      renderHeader={() => null}
      renderFooter={() => <Footer />}
    >
      <Box w={["full", "sm"]} mx="auto">
        <Formik
          initialValues={{
            email: email,
            date: dayjs().format("YYYY-MM-DD"),
            time: nextInterval().format("HH:mm")
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            basket.setDate(values.date)
            basket.setTime(values.time)
            // router.push({
            //   pathname: "/checkout/payment"
            // })
          }}
        >
          {(props) => (
            <Form>
              <VStack spacing="10">
                <Text>
                  {t('choose-collect-time')}
                </Text>
                <VStack>
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
    </Wrapper>
  )
}

export default CheckoutCollect
