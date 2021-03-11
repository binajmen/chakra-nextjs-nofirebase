import * as React from 'react'
import dayjs from 'dayjs'
import useTranslation from 'next-translate/useTranslation'

import {
  HStack,
  Text,
  Icon
} from '@chakra-ui/react'
import { FaRegCalendarCheck } from 'react-icons/fa'

import type { OpeningHours } from '@/types/place'
import type { Method } from '@/types/common'

type TodayOpeningProps = {
  method: Method
  opening: OpeningHours
}

export default function TodayOpening({ method, opening }: TodayOpeningProps) {
  const { t } = useTranslation('common')
  const today = dayjs().format('ddd').toLowerCase()

  function toString(time: string) {
    return time.substring(0, 2) + ':' + time.substring(2)
  }

  if (!method)
    return null

  return (
    <HStack>
      <Text>{t(dayjs().format('ddd'))}:</Text>
      {opening[method][today].map((_, index, src) => {
        if (index % 2 === 0 && index + 1 < src.length) {
          return <Text key={index}>{toString(src[index])} – {toString(src[index + 1])}</Text>
        } else if (index < src.length - 1) {
          return <Text key={index} color="gray.300">/</Text>
        }
      })}
    </HStack>
  )
}
