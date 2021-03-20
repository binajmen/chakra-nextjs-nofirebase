import * as React from 'react'
import * as Yup from 'yup'
import useTranslation from 'next-translate/useTranslation'
import { withAuthUser } from 'next-firebase-auth'
import { useRouter } from 'next/router'
import { Formik, Form, Field, FieldProps } from 'formik'

import {
  Box,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  Progress,
  Heading
} from '@chakra-ui/react'

import { useStoreState, useStoreActions } from '@/store/hooks'
import { useStoreRehydrated } from 'easy-peasy'

import Wrapper from '@/layout/Wrapper'
import StandardHeader from '@/components/layouts/StandardHeader'
import Footer from '@/layout/client/Footer'
import Button from '@/components/atoms/Button'


const validationSchema = Yup.object().shape({
  name: Yup.string().required().min(2)
})

function CheckoutNow() {
  const { t } = useTranslation('checkout')
  const router = useRouter()

  const name = useStoreState(state => state.basket.name)
  const basket = useStoreActions(actions => actions.basket)
  const isRehydrated = useStoreRehydrated()

  if (!isRehydrated) {
    return <Progress size="xs" isIndeterminate />
  }

  return (
    <Wrapper
      title="Order.brussels"
      renderHeader={() => <StandardHeader withMethod={false} />}
      renderFooter={() => <Footer />}
    >
      <Box w={["full", "sm"]} mx="auto">
        <Formik
          initialValues={{ name: name }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            basket.setName(values.name)
            router.push({
              pathname: "/checkout/payment"
            })
          }}
        >
          {(props) => (
            <Form>
              <VStack spacing="5">
                <Heading>{t('common:now')}</Heading>
                <Text>
                  {t('give-your-name')}
                </Text>
                <Field name="name">
                  {({ field, form, meta }: FieldProps) => (
                    <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                      <FormLabel htmlFor="name">{t('name')}</FormLabel>
                      <Input {...field} id="name" placeholder="" />
                      <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
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

export default withAuthUser()(CheckoutNow)

export function getStaticProps() { return { props: {} } }
