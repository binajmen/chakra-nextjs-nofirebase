import * as React from 'react'
import { FieldInputProps } from 'formik'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

import {
  Select
} from '@chakra-ui/react'

import { nextInterval, buildIntervals } from '@/helpers/hours'

type TimeIntervalFieldProps = FieldInputProps<string> & {
  id: string
  opening: string[]
  isToday: boolean
  resetValue: (value: string) => void
}

export default function TimeIntervalField({
  opening, // = ["0800", "1300", "1400", "1500"]
  isToday,
  resetValue,
  ...restProps
}: TimeIntervalFieldProps) {
  const interval = 30
  const start = isToday ? nextInterval(interval) : dayjs(opening[0], "HHmm")

  const intervals = React.useMemo(() => buildIntervals(start, start.hour(22).minute(0), interval), [start])

  React.useEffect(() => {
    if (isToday)
      resetValue(nextInterval().format("HH:mm"))
  }, [isToday])

  return (
    <Select {...restProps}>
      {intervals.map((interval, index) =>
        <option key={index} value={interval}>{interval}</option>
      )}
    </Select>
  )
}
