import * as React from "react"
import dayjs from "dayjs"
import useTranslation from "next-translate/useTranslation"
import { useRouter } from 'next/router'
import { fuego, useCollection } from '@nandorojo/swr-firestore'

import {
  Flex,
  Box,
  Stack,
  Grid,
  GridItem,
  Collapse,
  Heading,
  Text,
  Badge,
  Icon,
  Tabs,
  TabPanels,
  TabPanel,
  useToast,
  useDisclosure
} from '@chakra-ui/react'
import { FaWalking, FaBicycle, FaUtensils, FaBan, FaComment, FaCommentSlash } from 'react-icons/fa'

import firebase from '@/lib/firebase/client'
import { VALID, ACCEPTED, REJECTED, PLANNED, ONGOING, READY, COMPLETED } from '@/helpers/constants'

import OrdersNavigation from './OrdersNavigation'
import Button from '@/components/atoms/Button'

import type { WithID } from '@/types/catalog'
import type { Order } from '@/types/order'

type OrdersProps = {
}

export default function Orders(props: OrdersProps) {
  const router = useRouter()
  const placeId = router.query.placeId
  const [tabIndex, setTabIndex] = React.useState(0)
  const [orders, setOrders] = React.useState<WithID<Order>[]>([])

  const sixAM = dayjs().hour() < 6
    ? dayjs().startOf('day').subtract(1, 'day').add(6, 'hour') // yesterday @6am
    : dayjs().startOf('day').add(6, 'hour') // today @6am

  const pending = React.useMemo(() => orders.filter(o => o.orderStatus === VALID), [orders])
  const planned = React.useMemo(() => orders.filter(o => o.orderStatus === PLANNED), [orders])
  const ongoing = React.useMemo(() => orders.filter(o => o.orderStatus === ONGOING), [orders])
  const ready = React.useMemo(() => orders.filter(o => o.orderStatus === READY), [orders])
  const history = React.useMemo(() => orders.filter(o => ![VALID, PLANNED, ONGOING, READY].includes(o.orderStatus)), [orders])

  React.useEffect(() => {
    firebase.firestore().collection("orders")
      .where("placeId", "==", placeId)
      .where("log.valid", ">", sixAM.toDate())
      .onSnapshot((snapshot) => {
        var orders = snapshot.docs.map(doc => ({ ...doc.data() as Order, id: doc.id }))
        setOrders(orders)
      }, (error) => {
        console.error(error)
      })
  }, [])

  return (
    <Box p="3">
      <Box position="fixed">
        <OrdersNavigation
          counter={{
            pending: pending.length,
            planned: planned.length,
            ongoing: ongoing.length,
            ready: ready.length,
          }}
          onClick={(index) => setTabIndex(index)}
        />
      </Box>
      <Box pl={120}>
        <Tabs index={tabIndex}>
          <TabPanels>
            <TabPanel><Panel orders={pending} component={OrderTile} /></TabPanel>
            <TabPanel><Panel orders={planned} component={OrderTile} /></TabPanel>
            <TabPanel><Panel orders={ongoing} component={OrderTile} /></TabPanel>
            <TabPanel><Panel orders={ready} component={OrderTile} /></TabPanel>
            <TabPanel><Panel orders={history} component={OrderTile} /></TabPanel>
            <TabPanel>
              Settings
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  )
}

type PanelProps = {
  orders: WithID<Order>[]
  component: any
}

function Panel({ orders, component: Component }: PanelProps) {
  return (
    <Stack direction="column" spacing="3">
      {orders.map(order =>
        <Component key={order.id} order={order} />
      )}
    </Stack>
  )
}

type OrderProps = {
  order: WithID<Order>
}

function OrderTile({ order }: OrderProps) {
  const collapse = useDisclosure()

  return (
    <Box bgColor="#fafafa" border="1px solid lightgray" borderRadius="lg" p="3">
      <OrderTileHeader order={order} openDetails={collapse.onToggle} />

      <Collapse in={collapse.isOpen}>
        <OrderTileInfo order={order} />
        <OrderTileItems order={order} />
        <OrderTileFooter order={order} />
      </Collapse>
    </Box>
  )
}

type OrderTileHeaderProps = {
  order: WithID<Order>
  openDetails: () => void
}

function OrderTileHeader({ order, openDetails }: OrderTileHeaderProps) {
  const { t } = useTranslation("checkout")

  return (
    <Flex justify="space-between" alignItems="center" onClick={openDetails}>

      <Stack direction="column">
        <Heading size="md">{order.client.name}</Heading>
        <Text as="pre">#{order.id.slice(-5).toUpperCase()}</Text>
      </Stack>

      <Stack direction="row" alignItems="center" spacing="6">

        <Badge
          px="2" py="1"
          fontSize="sm"
          borderRadius="lg"
          colorScheme={order.payment.status === "paid" ? "green" : "red"}
        >
          {t(order.payment.status)}
        </Badge>
        <Heading
          size="lg"
          color={order.payment.status === "paid" ? "green" : "red"}
        >
          {order.total / 100}€
        </Heading>

        <Box borderRight="1px solid black" h="40px" w="1" />

        <Stack direction="row" alignItems="center" spacing="3">
          <Text fontSize="sm" textAlign="right">Temps de<br />préparation</Text>
          <Stack direction="column" alignItems="center" spacing="0">
            <Heading size="lg" mb="-1">8</Heading>
            <Text>min</Text>
          </Stack>
        </Stack>
        <Box borderRight="1px solid black" h="40px" w="1" />
        <Icon as={order.method === "collect" ? FaWalking : FaBicycle} boxSize="9" mr="3" />
      </Stack>
    </Flex>
  )
}

function OrderTileInfo({ order }: OrderProps) {
  const hasComments = order.items.reduce((a, c) => (c.comment ?? "") !== "" ? a + 1 : a, 0)

  return (
    <Flex justify="space-between" alignItems="center" borderTop="1px solid gray" mt="3" pt="3">
      <Stack direction="row">
        <Icon
          boxSize="6"
          as={order.utensils ? FaUtensils : FaBan}
          color={order.utensils ? "tomato" : "gray"}
        />
        <Text
          as="strong"
          color={order.utensils ? "tomato" : "gray"}
        >
          {order.utensils ? "Vaisselle jetable" : "Pas de vaisselle jetable"}
        </Text>
      </Stack>
      <Stack direction="row" alignItems="center">
        {hasComments && <Text as="strong" color="tomato">{hasComments}</Text>}
        <Icon
          boxSize="9" mr="3"
          as={hasComments ? FaComment : FaCommentSlash}
          color={hasComments ? "tomato" : "gray"}
        />
      </Stack>
    </Flex>
  )
}

function OrderTileItems({ order }: OrderProps) {
  return (
    <Flex justify="space-between" alignItems="center" borderTop="1px solid gray" mt="3" pt="3">
      <Grid templateColumns="auto 1fr auto" gap={2} w="full">
        {order.items.map(item =>
          <React.Fragment key={item.id}>

            <GridItem
              rowSpan={1 + item.options.length + ((item.comment ?? "") !== "" ? 1 : 0)}
            >
              <Stack direction="row" alignItems="center" spacing="1">
                <Heading size="lg">{item.quantity}</Heading>
                <Heading size="md">x</Heading>
              </Stack>
            </GridItem>

            <GridItem px="3">
              <Heading size="lg">{item.name}</Heading>
            </GridItem>
            <GridItem justifySelf="end" alignSelf="center">
              <Heading size="md">{item.price / 100}€</Heading>
            </GridItem>

            {item.options.length > 0 && item.options.map(option =>
              <React.Fragment key={item.id}>
                <GridItem px="6">
                  <Text size="lg">{option.name}</Text>
                </GridItem>
                <GridItem justifySelf="end" alignSelf="center">
                  <Text size="md">{option.price / 100}€</Text>
                </GridItem>
              </React.Fragment>
            )}

            {(item.comment ?? "") !== "" &&
              <GridItem colSpan={2} px="6">
                <Stack direction="row" alignItems="center">
                  <Icon as={FaComment} boxSize="5" color="tomato" />
                  <Text color="tomato">{item.comment}</Text>
                </Stack>
              </GridItem>
            }
          </React.Fragment>
        )}
      </Grid>
    </Flex>
  )
}

function OrderTileFooter({ order }: OrderProps) {
  const { t } = useTranslation("checkout")
  const toast = useToast()

  function nextStatus() {
    switch (order.orderStatus) {
      case PLANNED:
        return "start"
      case ONGOING:
        return "ready"
      case READY:
        return "completed"
      default:
        return false
    }
  }

  if (order.orderStatus === "valid") {
    return (
      <Flex justify="space-between" alignItems="center" borderTop="1px solid gray" mt="3" pt="3">
        <Button
          color="white"
          colorScheme="red"
          onClick={() => updateStatus(order.id, REJECTED, toast)}
        >
          {t("rejected-verb").toUpperCase()}
        </Button>
        <Button onClick={() => updateStatus(order.id, ACCEPTED, toast)}>
          {t("accepted-verb").toUpperCase()}
        </Button>
      </Flex>
    )
  } else if (typeof nextStatus() === "boolean") {
    return null
  } else {
    return (
      <Flex justify="flex-end" alignItems="center" borderTop="1px solid gray" mt="3" pt="3">
        <Button onClick={() => updateStatus(order.id, nextStatus() as string, toast)}>
          {t(`${nextStatus()}-verb`).toUpperCase()}
        </Button>
      </Flex>
    )
  }
}

function updateStatus(orderId: string, newStatus: string, toast: any) {
  firebase.firestore().doc(`orders/${orderId}`)
    .update({
      orderStatus: newStatus,
      [`log.${newStatus}`]: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => toast({
      description: `Order #${orderId.slice(-5)} status updated to: ${newStatus.toUpperCase()}`,
      status: "success"
    }))
    .catch((error) => toast({
      description: error.message,
      status: "error"
    }))
}