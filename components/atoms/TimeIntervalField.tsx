import * as React from 'react'
import { FieldInputProps } from 'formik'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

import {
  Select
} from '@chakra-ui/react'

import { generateIntervals } from '@/helpers/datetime'

type TimeIntervalFieldProps = FieldInputProps<string> & {
  id: string
  date: string
  schedule: { [index: string]: string[] }
  interval: number
  setValue: (value: string) => void
}

export default function TimeIntervalField({
  date,
  schedule, // = ["08:00", "13:00", "14:00", "15:00"]
  interval,
  setValue,
  ...restProps
}: TimeIntervalFieldProps) {
  const intervals = React.useMemo(() => {
    const day = dayjs(date, "YYYY-MM-DD").format("ddd").toLowerCase()
    return generateIntervals(date, schedule[day], interval)
  }, [date, schedule, interval])

  React.useEffect(() => {
    if (!restProps.value)
      setValue(intervals.length > 0 ? intervals[0] : "––:––")
  }, [intervals])

  return (
    <Select {...restProps}>
      {intervals.map(interval =>
        <option key={interval} value={interval}>{interval}</option>
      )}
    </Select>
  )
}
