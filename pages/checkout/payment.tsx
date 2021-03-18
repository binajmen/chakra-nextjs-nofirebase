import * as React from 'react'
import * as Yup from 'yup'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { withAuthUser } from 'next-firebase-auth'
import { Formik, Form, Field, FieldProps } from 'formik'
import { useDocument, useCollection } from '@nandorojo/swr-firestore'

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

import Wrapper from '@/layout/Wrapper'
import StandardHeader from '@/components/layouts/StandardHeader'
import Footer from '@/layout/client/Footer'
import Button from '@/components/atoms/Button'
import PaymentMethods from '@/components/molecules/PaymentMethods'

import type { Place } from '@/types/place'

const validationSchema = Yup.object().shape({
  name: Yup.string().required().min(2)
})

function CheckoutNow() {
  const { t } = useTranslation('checkout')

  const method = useStoreState(state => state.basket.method)
  const placeId = useStoreState(state => state.basket.place)
  const basket = useStoreActions(actions => actions.basket)
  const isRehydrated = useStoreRehydrated()
  const { data: place } = useDocument<Place>(isRehydrated ? `places/${placeId}` : null)

  if (!isRehydrated || !place) {
    return <Progress size="xs" isIndeterminate />
  }

  const methods = place.payment[method as string]

  return (
    <Wrapper
      title="Order.brussels"
      renderHeader={() => <StandardHeader />}
      renderFooter={() => <Footer />}
    >
      <PaymentMethods methods={methods} />
    </Wrapper>
  )
}

export default withAuthUser()(CheckoutNow)
