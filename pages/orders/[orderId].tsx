import * as React from 'react'
import dayjs from 'dayjs'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { useDocument, useCollection } from '@nandorojo/swr-firestore'

import {
  Stack,
  HStack,
  Wrap,
  WrapItem,
  Box,
  Flex,
  Heading,
  Text,
  Badge,
  Center,
  Icon,
  CircularProgress,
  Progress
} from '@chakra-ui/react'
import { FaChevronRight, FaCheck } from 'react-icons/fa'

import { useStoreState, useStoreActions } from '@/store/hooks'
import { useStoreRehydrated } from 'easy-peasy'

import { nextInterval } from '@/helpers/hours'

import Wrapper from '@/layout/Wrapper'
import StandardHeader from '@/components/layouts/StandardHeader'
import Footer from '@/layout/client/Footer'
import Button from '@/components/atoms/Button'
import DateField from '@/components/atoms/DateField'
import TimeIntervalField from '@/components/atoms/TimeIntervalField'

import type { Order } from '@/types/basket'

function CheckoutCollect() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const orderId = router.query.orderId as string

  const { data: order, loading, error } = useDocument<Order>(`orders/${orderId}`, { listen: true })

  const email = useStoreState(state => state.basket.email)
  const basket = useStoreActions(actions => actions.basket)
  const isRehydrated = useStoreRehydrated()

  if (!isRehydrated || loading) {
    return <Progress size="xs" isIndeterminate />
  } else if (error) {
    return <Text>Unable to retrieve the order at the moment. Please try again later.</Text>
  }

  return (
    <Wrapper
      title="Order.brussels"
      renderHeader={() => <StandardHeader />}
      renderFooter={() => <Footer />}
    >
      <Stack direction="column">
        <Heading size="lg" mb="3">Récapitulatif de votre commande</Heading>
        <Wrap>
          <WrapItem><Text fontSize="sm" as="b">Type de commande :</Text></WrapItem>
          <WrapItem><Text fontSize="sm">{t(order!.method)}</Text></WrapItem>
        </Wrap>
        <Wrap>
          <WrapItem><Text fontSize="sm" as="b">Commande # :</Text></WrapItem>
          <WrapItem><Text fontSize="sm">{order!.id}</Text></WrapItem>
        </Wrap>
        <Wrap>
          <WrapItem><Text fontSize="sm" as="b">Commerce :</Text></WrapItem>
          <WrapItem><Text fontSize="sm">{order!.placeId}</Text></WrapItem>
        </Wrap>
        <Wrap>
          <WrapItem><Text fontSize="sm" as="b">Paiement :</Text></WrapItem>
          <WrapItem><Badge borderRadius="lg">{t(order!.payment.method)}</Badge></WrapItem>
          <WrapItem><Badge borderRadius="lg" colorScheme={order!.payment.status === "paid" ? "green" : "red"}>{t(order!.payment.status)}</Badge></WrapItem>
        </Wrap>
        <hr />
        <Stack direction="column" maxW="lg" py="2">
          <Center><Heading size="sm">Statut de votre commande :</Heading></Center>
          <Flex justify="space-around">
            <Status status="new" label={t('sent')} current={order!.progress} />
            <Center><Icon as={FaChevronRight} color="gray.300" /></Center>
            <Status status="ongoing" label={t('ongoing')} current={order!.progress} />
            <Center><Icon as={FaChevronRight} color="gray.300" /></Center>
            <Status status="completed" label={t('completed')} current={order!.progress} />
          </Flex>
        </Stack>
        <hr />
        <Stack direction="column" p="3" spacing="2" border="1px solid" borderColor="gray.100" borderRadius="lg" boxShadow="lg" maxW="lg">
          <Heading size="md">Articles</Heading>
          {order!.items.map(item => (
            <Flex alignItems="space-between">
              <Text w="full">{item.quantity} x {item.longName}</Text>
              <Text size="md">{item.total / 100}€</Text>
            </Flex>
          ))}
          <hr />
          <Flex alignItems="space-between">
            <Text w="full">Total :</Text>
            <Text size="md">{order!.total / 100}€</Text>
          </Flex>
        </Stack>
      </Stack>
    </Wrapper>
  )
}

export default CheckoutCollect

type StatusProps = {
  status: string
  label: string
  current: string
}

function Status({ status, label, current }: StatusProps) {
  const weight: any = { "new": 1, "ongoing": 2, "completed": 3 }

  if (current === status) {
    return (
      <Center>
        <Badge borderRadius="lg" fontSize="0.8rem" colorScheme="green">
          <HStack>
            {current !== "completed"
              ? <CircularProgress isIndeterminate color="green.300" size="3" />
              : <Icon as={FaCheck} />
            }
            <Text>{label}</Text>
          </HStack>
        </Badge>
      </Center>
    )
  } else if (weight[status] < weight[current]) {
    return (
      <Center>
        <Badge borderRadius="lg" fontSize="0.8rem" colorScheme="green">
          <HStack>
            <Icon as={FaCheck} />
            <Text>{label}</Text>
          </HStack>
        </Badge>
      </Center>
    )
  } else {
    return <Center><Badge borderRadius="lg" fontSize="0.8rem" colorScheme="white">{label}</Badge></Center>
  }
}
