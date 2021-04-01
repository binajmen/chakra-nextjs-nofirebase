import * as React from "react"
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { useAuthUser } from 'next-firebase-auth'

import {
  Box,
  Flex,
  Heading,
  Text,
  Icon,
  Center,
  useToast,
} from '@chakra-ui/react'
import { FaMoneyBillWave, FaRegCreditCard, FaMobileAlt, FaCheckCircle, FaRegCircle } from 'react-icons/fa'

import Button from '@/components/atoms/Button'

import firebase from "@/lib/firebase/client"
import { useStoreState, useStoreActions } from "@/store/hooks"
import { UNPAID } from "@/helpers/constants"

type PaymentMethodsProps = {
  methods: string[]
}

export default function PaymentMethods({ methods }: PaymentMethodsProps) {
  const { t } = useTranslation('checkout')
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = React.useState<boolean>(false)

  const basket = useStoreState(state => state.basket)

  function initOrder() {
    setLoading(true)
    createOrder()
  }

  function createOrder() {
    const order = {
      placeId: basket.placeId,
      method: basket.method,
      timing: {
        date: basket.date,
        time: basket.time
      },
      client: {
        id: basket.client.id,
        name: basket.client.name,
        email: basket.client.email,
        phone: basket.client.phone,
        address: basket.client.address
      },
      // deliverer: {
      //   id: ,
      //   name: ,
      //   phone: ,
      // },
      // location: {
      //   type: user.location.type,
      //   value: user.location.type === 'M' ? user.phone : user.location.value,
      // },
      // table: table,
      items: basket.items,
      total: basket.total,
      payment: {
        status: UNPAID,
        method: basket.payment
      },
      online: basket.payment === "online"
      // progress: basket.items.reduce((acc, cur) => {
      //   return {
      //     ...acc,
      //     ...cur.devices.reduce((a, c) => {
      //       return {
      //         ...a,
      //         [c]: 'new'
      //       }
      //     }, {})
      //   }
      // }, {})
      // created: firebase.firestore.FieldValue.serverTimestamp()
    }

    let functions = null
    if (process.env.NODE_ENV === "development") {
      functions = firebase.app().functions()
    } else {
      functions = firebase.app().functions('europe-west1')
    }

    if (basket.payment === 'online') {
      let createOnlineOrder = functions.httpsCallable('createOnlineOrder')
      createOnlineOrder(order)
        .then(result => {
          if (result.data === false) {
            toast({
              description: t('order-failed'),
              status: "error"
            })
            setLoading(false)
          } else {
            console.log(result.data)
            window.location = result.data._links.checkout.href
          }
        })
    } else {
      let createOfflineOrder = functions.httpsCallable('createOfflineOrder')
      createOfflineOrder(order)
        .then(result => {
          if (result.data === false) {
            toast({
              description: t('order-failed'),
              status: "error"
            })
            setLoading(false)
          } else {
            router.push({
              pathname: "/orders/[orderId]",
              query: { orderId: result.data, emptyBasket: 1 }
            })
          }
          // actions.archiveBasket(result.data)
          // history.push(`/${merchant.slug}/orders`)
        })
    }
  }

  return (
    <Box>
      <Heading mb="2">Méthode de paiement</Heading>
      <Text mb="2">Merci de choisir votre méthode de paiement parmi les possibilités ci-dessous :</Text>
      {["cash", "card", "online"]
        .filter(m => methods.includes(m))
        .map(method => <PaymentMethod key={method} method={method} />)}
      <Center>
        <Button mt="12" disabled={loading || basket.payment === ""} isLoading={loading} onClick={initOrder}>{t('common:validate')}</Button>
      </Center>
    </Box>
  )
}

const payments: any = {
  cash: {
    heading: "Monnaie",
    icon: FaMoneyBillWave
  },
  card: {
    heading: "Carte",
    icon: FaRegCreditCard
  },
  online: {
    heading: "En ligne",
    icon: FaMobileAlt
  }
}

function PaymentMethod({ method }: { method: string }) {
  const payment = useStoreState(state => state.basket.payment)
  const setPayment = useStoreActions(actions => actions.basket.setPayment)

  return (
    <Button
      w="full"
      padding="2rem"
      mt="3"
      color="gray.900"
      colorScheme={payment === method ? "primary" : "gray"}
      onClick={() => setPayment(method)}
    >
      <Flex my="3" justify="space-between" w="full">
        <Center><Icon boxSize="7" as={payments[method].icon} /></Center>
        <Box flex="1"><Heading size="md">{payments[method].heading}</Heading></Box>
        <Center><Icon boxSize="5" as={payment === method ? FaCheckCircle : FaRegCircle} /></Center>
      </Flex>
    </Button>
  )
}
