import * as React from 'react'
import * as Yup from 'yup'
import useTranslation from 'next-translate/useTranslation'
import { withAuthUser } from 'next-firebase-auth'
import { useDocument } from '@nandorojo/swr-firestore'

import {
  Box,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  Progress
} from '@chakra-ui/react'

import { useStoreState, useStoreActions } from '@/store/hooks'
import { useStoreRehydrated } from 'easy-peasy'

import Layout from '@/components/layout/Layout'
import PaymentMethods from '@/components/molecules/PaymentMethods'

import type { Place } from '@/types/place'

const validationSchema = Yup.object().shape({
  name: Yup.string().required().min(2)
})

function CheckoutPayment() {
  const { t } = useTranslation('checkout')

  const method = useStoreState(state => state.basket.method)
  const placeId = useStoreState(state => state.basket.placeId)
  const basket = useStoreActions(actions => actions.basket)
  const isRehydrated = useStoreRehydrated()
  const { data: place } = useDocument<Place>(isRehydrated ? `places/${placeId}` : null)

  if (!isRehydrated || !place) {
    return <Progress size="xs" isIndeterminate />
  }

  const methods = place.payment[method as string]

  return (
    <Layout
      subHeader="hide"
      metadata={{ title: "Myresto.brussels" }}
    >
      <PaymentMethods methods={methods} />
    </Layout>
  )
}

export default withAuthUser()(CheckoutPayment)

export function getStaticProps() { return { props: {} } }
