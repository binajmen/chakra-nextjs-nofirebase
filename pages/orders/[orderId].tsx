import * as React from 'react'
import dayjs from 'dayjs'
import useTranslation from 'next-translate/useTranslation'
import { withAuthUser } from 'next-firebase-auth'
import { useRouter } from 'next/router'
import { useDocument, useCollection } from '@nandorojo/swr-firestore'

import {
  Stack,
  HStack,
  Wrap,
  WrapItem,
  Button,
  Flex,
  Heading,
  Text,
  Badge,
  Center,
  Icon,
  CircularProgress,
  Collapse,
  Progress
} from '@chakra-ui/react'
import { FaChevronRight, FaChevronDown, FaCheck } from 'react-icons/fa'

import { useStoreState, useStoreActions } from '@/store/hooks'
import { useStoreRehydrated } from 'easy-peasy'

import { nextInterval } from '@/helpers/hours'

import Wrapper from '@/layout/Wrapper'
import StandardHeader from '@/components/layouts/StandardHeader'
import Footer from '@/layout/client/Footer'
import OrderId from '@/components/atoms/OrderId'
import OrderStatus from '@/components/atoms/OrderStatus'
import DateField from '@/components/atoms/DateField'
import TimeIntervalField from '@/components/atoms/TimeIntervalField'

import type { Order } from '@/types/basket'
import type { Place } from '@/types/place'

function OrderDetails() {
  const router = useRouter()
  const orderId = router.query.orderId as string
  const [details, showDetails] = React.useState<boolean>(false)
  const { t } = useTranslation('common')

  const { data: order, loading, error } = useDocument<Order>(`orders/${orderId}`, { listen: true })
  const { data: place } = useDocument<Place>(order ? `places/${order.placeId}` : null)

  const email = useStoreState(state => state.basket.email)
  const basket = useStoreActions(actions => actions.basket)
  const isRehydrated = useStoreRehydrated()

  React.useEffect(() => {
    if ("emptyBasket" in router.query && router.query.emptyBasket === "1") {
      setTimeout(() => basket.clearBasket(), 2000)
    }
  }, [router.query])

  if (!isRehydrated || loading) {
    return <Progress size="xs" isIndeterminate />
  } else if (error) {
    return <Text>Unable to retrieve the order at the moment. Please try again later.</Text>
  }

  return (
    <Wrapper
      title="Order.brussels"
      renderHeader={() => <StandardHeader withMethod={false} />}
      renderFooter={() => <Footer />}
    >
      <Stack direction="column">
        <Center mb="5"><Heading size="md">Votre commande</Heading></Center>
        <Center mb="5"><OrderId size="xl" expSize="md" id={order!.id} expandable={true} /></Center>
        <Stack direction="column" maxW="lg" py="2" mb="4">
          <Flex justify="space-around">
            <OrderStatus status="queuing" label={t('queuing')} current={order!.progress} />
            <Center><Icon as={FaChevronRight} color="gray.300" /></Center>
            <OrderStatus status="ongoing" label={t('ongoing')} current={order!.progress} />
            <Center><Icon as={FaChevronRight} color="gray.300" /></Center>
            <OrderStatus status="ready" label={t('ready')} current={order!.progress} />
          </Flex>
        </Stack>
        <Stack direction="column" p="3" spacing="2" border="1px solid" borderColor="gray.100" borderRadius="lg" boxShadow="lg" maxW="lg">
          <Heading size="md">Articles</Heading>
          {order!.items.map(item => (
            <Flex justify="space-between">
              <Text>{item.quantity} x {item.longName}</Text>
              <Text>{item.total / 100}€</Text>
            </Flex>
          ))}
          <hr />
          <Flex justify="space-between">
            <Text as="b">Total :</Text>
            <Text as="b">{order!.total / 100}€</Text>
          </Flex>
        </Stack>
        <Stack direction="column">
          <Button variant="ghost"
            size="sm"
            colorScheme="white"
            onClick={() => showDetails(!details)}
            rightIcon={details ? <FaChevronDown /> : <FaChevronRight />}
          >Détails</Button>
          <Collapse in={details}>
            <Wrap>
              <WrapItem><Text fontSize="sm" as="b">Date :</Text></WrapItem>
              <WrapItem><Text fontSize="sm">{dayjs.unix(order!.createdAt.seconds).format('DD/MM/YYYY HH:mm:ss')}</Text></WrapItem>
            </Wrap>
            <Wrap>
              <WrapItem><Text fontSize="sm" as="b">Commerce :</Text></WrapItem>
              <WrapItem><Text fontSize="sm">{place?.name}</Text></WrapItem>
            </Wrap>
            <Wrap>
              <WrapItem><Text fontSize="sm" as="b">Type de commande :</Text></WrapItem>
              <WrapItem><Text fontSize="sm">{t(order!.method)}</Text></WrapItem>
            </Wrap>
            <Wrap>
              <WrapItem><Text fontSize="sm" as="b">Paiement :</Text></WrapItem>
              <WrapItem><Badge borderRadius="lg">{t(order!.payment.method)}</Badge></WrapItem>
              <WrapItem><Badge borderRadius="lg" colorScheme={order!.payment.status === "paid" ? "green" : "red"}>{t(order!.payment.status)}</Badge></WrapItem>
            </Wrap>
          </Collapse>
        </Stack>
      </Stack>
    </Wrapper>
  )
}

export default withAuthUser()(OrderDetails)

export function getServerSideProps() { return { props: {} } }
