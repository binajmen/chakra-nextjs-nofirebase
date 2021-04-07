import * as React from 'react'
import useTranslation from 'next-translate/useTranslation'

import {
  Center,
  HStack,
  Icon,
  Text,
  Heading
} from '@chakra-ui/react'
import { FaStoreAlt, FaWalking, FaShippingFast, FaMapMarkedAlt } from 'react-icons/fa'

const methodIcon: any = {
  onsite: FaStoreAlt,
  collect: FaWalking,
  delivery: FaShippingFast,
  geolocation: FaMapMarkedAlt,
}

type MethodProps = {
  method: string
}

export default function Method({ method }: MethodProps) {
  const { t } = useTranslation('common')

  return (
    <HStack as={Center} spacing="3" py="3">
      <Icon boxSize="9" as={methodIcon[method]} />
      <Heading size="md">{t(method)}</Heading>
    </HStack>
  )
}
