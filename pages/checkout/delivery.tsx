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
  FormHelperText,
  FormErrorMessage,
  Input,
  Select,
  VStack,
  Progress,
  Heading
} from '@chakra-ui/react'

import { useStoreState, useStoreActions } from '@/store/hooks'
import { useStoreRehydrated } from 'easy-peasy'

import Layout from '@/components/layout/Layout'
import Button from '@/components/atoms/Button'

const postcodes: { [index: string]: string } = {
  1000: "Bruxelles / Brussel",
  1020: "Laeken / Laken",
  1030: "Schaarbeek / Schaerbeek",
  1040: "Etterbeek",
  1050: "Ixelles / Elsene",
  1060: "Saint-Gilles / Sint-Gillis",
  1070: "Anderlecht",
  1080: "Molenbeek-Saint-Jean / Sint-Jans-Molenbeek",
  1081: "Koekelberg",
  1082: "Berchem-Sainte-Agathe / Sint-Agatha-Berchem",
  1083: "Ganshoren",
  1090: "Jette",
  1120: "Neder-Over-Heembeek",
  1130: "Haeren / Haren",
  1140: "Evere",
  1150: "Woluwe-Saint-Pierre / Sint-Pieters-Woluwe",
  1160: "Auderghem / Oudergem",
  1170: "Watermael-Boitsfort / Watermaal-Bosvoorde",
  1180: "Uccle / Ukkel",
  1190: "Forest / Vorst",
  1200: "Woluwe-Saint-Lambert / Sint-Lambrechts-Woluwe",
  1210: "Saint-Josse-ten-Noode / Sint-Joost-ten-Node"
}

function CheckoutDelivery() {
  const { t } = useTranslation('checkout')
  const router = useRouter()

  const name = useStoreState(state => state.basket.name)
  const email = useStoreState(state => state.basket.email)
  const phone = useStoreState(state => state.basket.phone)
  const address = useStoreState(state => state.basket.address)
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
            street: address.street,
            postcode: address.postcode || "1000"
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            phone: Yup.string().required(),
            street: Yup.string().required()
              .test(
                "has-a-street-name",
                "Are you sure you specified a street name?",
                (value) => /[\w\s]{5,}/g.test(value || "")
              ).test(
                "has-a-street-number",
                "Are you sure you specified a street number?",
                (value) => /[\d]{1,}/g.test(value || "")
              ),
            postcode: Yup.string().required()
          })}
          onSubmit={(values) => {
            const { email, ...rest } = values

            basket.setEmail(email)
            basket.setAddress({ ...rest, city: postcodes[values.postcode] })

            router.push({
              pathname: "/checkout/payment"
            })
          }}
        >
          {(props) => (
            <Form>
              <VStack spacing="5">
                <Heading>{t('common:delivery')}</Heading>
                <Text>
                  {t('give-your-address')}
                </Text>
                <VStack w="full">
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
                  <Field name="street">
                    {({ field, form, meta }: FieldProps) => (
                      <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                        <FormLabel htmlFor="street">{t('street')}</FormLabel>
                        <Input {...field} id="street" placeholder="" />
                        <FormErrorMessage>{form.errors.street}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="postcode">
                    {({ field, form, meta }: FieldProps) => (
                      <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                        <FormLabel htmlFor="postcode">{t('postcode')}</FormLabel>
                        <Select {...field}>
                          {Object.entries(postcodes).map(([postcode, city], index) =>
                            <option key={index} value={postcode}>{postcode} ({city})</option>
                          )}
                        </Select>
                        <FormErrorMessage>{form.errors.postcode}</FormErrorMessage>
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

export default withAuthUser()(CheckoutDelivery)

export function getStaticProps() { return { props: {} } }
