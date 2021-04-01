import * as React from 'react'

import {
  HStack,
  Text,
  Badge,
  Center,
  Icon,
  CircularProgress,
} from '@chakra-ui/react'
import { FaCheck } from 'react-icons/fa'

import { ORDERSTATUS } from "@/helpers/constants"

type OrderStatusProps = {
  status: string
  label: string
  current: string
}

export default function OrderStatus({ status, label, current }: OrderStatusProps) {
  // const weight: any = { "planned": 1, "waiting": 2, "ongoing": 3, "ready": 4 }
  const weight = ORDERSTATUS.reduce((acc, cur, index) => (
    { ...acc, [cur]: index }
  ), {} as { [index: string]: number })

  if (current === status) {
    return (
      <Center>
        <Badge borderRadius="lg" fontSize="0.8rem" colorScheme="green">
          <HStack>
            {current !== "ready"
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
    return <Center>
      <Badge borderRadius="lg" fontSize="0.8rem" colorScheme="white">{label}</Badge>
    </Center>
  }
}
