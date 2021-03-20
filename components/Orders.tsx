import * as React from 'react'
import dayjs from 'dayjs'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { fuego, useCollection } from '@nandorojo/swr-firestore'

import {
  Button,
  Box,
  Flex,
  Spacer,
  Heading,
  Text,
  Center,
  Icon,
  Collapse,
  Progress
} from '@chakra-ui/react'
import { FaChevronRight, FaChevronDown, FaSyncAlt } from 'react-icons/fa'

import { useStoreState } from '@/store/hooks'
import { useStoreRehydrated } from 'easy-peasy'

import OrderId from '@/components/atoms/OrderId'
import OrderStatus from '@/components/atoms/OrderStatus'

import type { Order } from '@/types/basket'

const LIMIT = 1

export default function Orders() {
  const router = useRouter()
  const orderId = router.query.orderId as string
  const [details, showDetails] = React.useState<string>("")
  const [hasNoMore, noMore] = React.useState<boolean>(false)
  const { t } = useTranslation('common')

  const userId = useStoreState(state => state.basket.userId)
  const isRehydrated = useStoreRehydrated()

  const { data: orders, loading, error, mutate } = useCollection<Order>(
    userId ? "orders" : null,
    {
      where: ["userId", "==", userId],
      orderBy: ["createdAt", "desc"],
      limit: LIMIT,
      // https://github.com/nandorojo/swr-firestore#paginate-a-collection
      ignoreFirestoreDocumentSnapshotField: false,
    },
    {
      revalidateOnFocus: false,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
      refreshInterval: 0,
    }
  )

  async function paginate() {
    if (!orders?.length) return

    const ref = fuego.db.collection("orders")

    // get the snapshot of last document we have right now in our query
    const startAfterDocument = orders[orders.length - 1].__snapshot

    // get more documents, after the most recent one we have
    const moreDocs = await ref
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(LIMIT)
      .startAfter(startAfterDocument)
      .get()
      .then((d: any) => {
        const docs: any[] = []
        d.docs.forEach((doc: any) => docs.push({ ...doc.data(), id: doc.id, __snapshot: doc }))
        return docs
      })

    if (moreDocs.length !== 0) {
      // mutate our local cache, adding the docs we just added
      // set revalidate to false to prevent SWR from revalidating on its own
      mutate(state => [...state!, ...moreDocs], false)
    } else {
      noMore(true)
    }
  }

  if (!isRehydrated) {
    return <Progress size="xs" isIndeterminate />
  }
  else if (error) {
    return <Text>Unable to retrieve your orders at the moment. Please try again later.</Text>
  }
  else if (!userId) {
    return <Text>No orders yet</Text>
  }
  else {
    return (
      <React.Fragment>
        <Center><Heading size="lg" mb="6">Vos commandes</Heading></Center>
        {orders?.map(order => (
          <Box p="3" key={order.id}>
            <Flex onClick={() => showDetails(details === order.id ? "" : order.id)}>
              <OrderId size="md" id={order.id} />
              <Spacer />
              <OrderStatus status={order.progress} label={t(order.progress)} current={order.progress} />
              <Center ml="3"><Icon as={order.id === details ? FaChevronDown : FaChevronRight} /></Center>
            </Flex>
            <Collapse in={order.id === details}>
              <Box mt="3" p="2" border="1px solid" borderColor="gray.100" borderRadius="lg" boxShadow="sm">
                {order.items.map(item => (
                  <Flex key={item.id} justify="space-between" mb="1">
                    <Text>{item.quantity} x {item.longName}</Text>
                    <Text>{item.total / 100}€</Text>
                  </Flex>
                ))}
                <hr />
                <Flex justify="space-between" mt="1">
                  <Text as="b">Total :</Text>
                  <Text as="b">{order!.total / 100}€</Text>
                </Flex>
              </Box>
              <Flex justify="space-between" mb="1">
                <Center ml="3"><Text fontSize="sm" color="gray">{dayjs.unix(order.createdAt.seconds).format('DD/MM/YYYY HH:mm')}</Text></Center>
                <Button
                  size="sm" variant="ghost"
                  rightIcon={<FaChevronRight />}
                  onClick={() => router.push({ pathname: "/orders/[orderId]", query: { orderId: order.id } })}
                >Détails</Button>
              </Flex>
            </Collapse>
          </Box>
        ))}
        <Center mt="5">
          <Text fontSize="sm" hidden={!hasNoMore}>No more orders.</Text>
          <Button size="xs" variant="ghost" onClick={paginate} hidden={hasNoMore} leftIcon={<FaSyncAlt />}>Load more</Button>
        </Center>
      </React.Fragment>
    )
  }
}
