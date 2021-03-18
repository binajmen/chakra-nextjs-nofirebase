import * as React from "react"
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { useAuthUser } from 'next-firebase-auth'
import { nanoid } from 'nanoid'

import {
  Box,
  Flex,
  Heading,
  Text,
  HStack,
  VStack,
  Icon,
  // Button,
  IconButton,
  LinkBox,
  LinkOverlay,
  useBreakpointValue,
  Center,
  useToast,
} from '@chakra-ui/react'
import { FaMoneyBillWave, FaRegCreditCard, FaMobileAlt, FaCheckCircle, FaRegCircle } from 'react-icons/fa'

import Button from '@/components/atoms/Button'
import NextButton from '@/components/atoms/NextButton'
import MethodMenu from '@/components/molecules/MethodMenu'
import LoginModal from '@/components/molecules/LoginModal'
import MenuDrawer from '@/components/organisms/MenuDrawer'

import { useStoreState, useStoreActions } from "@/store/hooks"
import firebase from "@/lib/firebase/client"

type PaymentMethodsProps = {
  methods: string[]
}

export default function PaymentMethods({ methods }: PaymentMethodsProps) {
  const router = useRouter()
  const toast = useToast()
  const authUser = useAuthUser()
  const { t } = useTranslation('checkout')
  const [loading, setLoading] = React.useState<boolean>(false)

  const basket = useStoreState(state => state.basket)

  function initOrder() {
    setLoading(true)
    createOrder()
  }

  function createOrder() {
    const order = {
      placeId: basket.place,
      userId: authUser.id || nanoid(),
      method: basket.method,
      // location: {
      //   type: user.location.type,
      //   value: user.location.type === 'M' ? user.phone : user.location.value,
      // },
      // table: table,
      // ...(business.sms === true && { sms: { to: phone } }),
      // tip: tip === "" ? 0 : +tip,
      items: basket.items,
      total: basket.total,
      // items: cleanCart,
      // ...(drinkItems.length > 0 && { drink: { status: "new", items: drinkItems } }),
      // ...(foodItems.length > 0 && { food: { status: "new", items: foodItems } }),
      payment: {
        status: "unpaid",
        method: basket.payment
      },
      progress: "new"
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
              pathname: "/order/[orderId]",
              query: { orderId: result.data }
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
        <Button mt="12" disabled={loading || basket.payment === ""} isLoading={loading} onClick={initOrder}>{t('validate')}</Button>
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
