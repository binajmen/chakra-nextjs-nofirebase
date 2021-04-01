import * as React from 'react'

import {
  Stack,
  Box,
  Center,
  Icon,
  Badge,
  Text
} from '@chakra-ui/react'
import { FaConciergeBell, FaClock, FaFire, FaShoppingBag, FaHistory, FaCog } from 'react-icons/fa'

import Button from '@/components/atoms/Button'

type OrdersNavigationProps = {
  counter: {
    [index: string]: number
  }
  onClick: (index: number) => void
}

const items = [
  { label: "pending", icon: FaConciergeBell },
  { label: "planned", icon: FaClock, color: "primary" },
  { label: "ongoing", icon: FaFire, color: "primary" },
  { label: "ready", icon: FaShoppingBag, color: "primary" },
  { label: "history", icon: FaHistory, color: "gray" },
  { label: "settings", icon: FaCog, color: "gray" },
]

export default function OrdersNavigation({ counter, onClick }: OrdersNavigationProps) {
  return (
    <Stack direction="column">
      {items.map((item, index) =>
        <Box key={item.label}>
          {item.label in counter &&
            <Badge
              position="absolute"
              right="0"
              zIndex="1000"
              fontSize="sm"
              color={item.label === "pending" ? (counter["pending"] === 0 ? "green" : "red") : "black"}
              bgColor="white"
              borderRadius="none"
            >{counter[item.label]}</Badge>
          }
          <Button
            w="full"
            py="10"
            colorScheme={item.label === "pending" ? (counter["pending"] === 0 ? "green" : "red") : item.color}
            color={item.label === "pending" ? (counter["pending"] === 0 ? "green" : "white") : "black"}
            variant={item.label === "pending" ? (counter["pending"] === 0 ? "ghost" : "solid") : "solid"}
            onClick={() => onClick(index)}
          >
            <Stack direction="column">
              <Center><Icon as={item.icon} boxSize="8" /></Center>
              <Center><Text fontSize="xs">{item.label}</Text></Center>
            </Stack>
          </Button>
        </Box>
      )}
    </Stack>
  )
}
