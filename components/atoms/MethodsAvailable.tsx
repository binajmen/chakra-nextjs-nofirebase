import * as React from 'react'
import useTranslation from 'next-translate/useTranslation'

import {
  Wrap,
  WrapItem,
  Badge,
  Text
} from '@chakra-ui/react'
import { FaChair, FaWalking, FaBicycle } from 'react-icons/fa'

import type { OpeningHours } from '@/types/place'
import type { Method } from '@/types/common'


const METHODS = ["now", "collect", "delivery"]

type TodayOpeningProps = {
  methods: string[]
  filter?: boolean
}

export default function MethodsAvailable({ methods, filter = false }: TodayOpeningProps) {
  const { t } = useTranslation('common')

  return (
    <Wrap>
      {METHODS.filter(m => !filter || methods.includes(m)).map(method =>
        <WrapItem key={method}>
          <Badge
            size="xs"
            borderRadius="md"
            px="2"
            colorScheme={methods.includes(method) ? 'orange' : 'white'}
          >
            {methods.includes(method) ? (
              <Text>{t(method)}</Text>
            ) : (
              <Text as="s" fontWeight="medium">{t(method)}</Text>
            )}
          </Badge>
        </WrapItem>
      )}
    </Wrap>
  )
}
