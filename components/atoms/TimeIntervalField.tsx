import * as React from 'react'
import { FieldInputProps } from 'formik'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

import {
  Select
} from '@chakra-ui/react'

import { createTimeInterval } from '@/helpers/hours'

type TimeIntervalFieldProps = FieldInputProps<string> & {
  id: string
  openingHours: { [index: string]: string[] }
  interval: number
  dateValue: string
  resetValue: (value: string) => void
}

export default function TimeIntervalField({
  openingHours, // = ["08:00", "13:00", "14:00", "15:00"]
  interval,
  dateValue,
  resetValue,
  ...restProps
}: TimeIntervalFieldProps) {
  const isToday = dayjs().isSame(dateValue, 'day')
  const dayOfWeek = dayjs(dateValue, "YYYY-MM-DD").format("ddd").toLowerCase()

  const intervals = React.useMemo(() => {
    return createTimeInterval(openingHours[dayOfWeek], interval, isToday)
  }, [openingHours, dayOfWeek, interval, isToday])

  React.useEffect(() => {
    resetValue(intervals.length > 0 ? intervals[0] : "––:––")
  }, [intervals])

  return (
    <Select {...restProps}>
      {intervals.map((interval, index) =>
        <option key={index} value={interval}>{interval}</option>
      )}
    </Select>
  )
}
