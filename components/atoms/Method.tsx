import * as React from 'react'
import useTranslation from 'next-translate/useTranslation'

import {
  Center,
  HStack,
  Icon,
  Text,
  Heading
} from '@chakra-ui/react'
import { FaChair, FaWalking, FaBicycle } from 'react-icons/fa'

type Methods = {
  [index: string]: {
    label: string
    icon: typeof FaChair
  }
}

type MethodProps = {
  method: string
}

export default function Method({ method }: MethodProps) {
  const { t } = useTranslation('common')

  const methods: Methods = {
    now: { label: "now", icon: FaChair },
    collect: { label: "collect", icon: FaWalking },
    delivery: { label: "delivery", icon: FaBicycle },
  }

  return (
    <HStack as={Center} spacing="3" py="3">
      <Icon boxSize="9" as={methods[method].icon} />
      <Heading size="md">{t(methods[method].label)}</Heading>
    </HStack>
  )
}
