import * as React from 'react'
import useTranslation from 'next-translate/useTranslation'
import dayjs from 'dayjs'
import isToday from "dayjs/plugin/isToday"
import { FieldInputProps } from 'formik'
dayjs.extend(isToday)

import {
  FormControl,
  FormLabel,
  Select
} from '@chakra-ui/react'

import type { OpeningHours } from '@/types/place'

import { hasRemainingIntervalsToday } from '@/helpers/datetime'

type DateFieldProps = FieldInputProps<string> & {
  id: string
  date: string,
  schedule: { [index: string]: string[] }
  interval: number,
  setValue: (value: string) => void
}

export default function DateField({ date, schedule, interval, setValue, ...fieldProps }: DateFieldProps) {
  const { t } = useTranslation('common')
  const scope = [0, 1, 2, 3, 4, 5, 6]

  function isOpen(ymd: string) {
    const day = dayjs(ymd, "YYYY-MM-DD")
    const short = day.format("ddd").toLowerCase()

    if (schedule[short].length === 0 || schedule[short].length % 2 !== 0) {
      return false
    } else if (day.isToday()) {
      return hasRemainingIntervalsToday(schedule[short], interval)
    } else {
      return true
    }
  }

  function optionLabel(shift: number) {
    const day = dayjs().add(shift, "day")
    const ymd = day.format("YYYY-MM-DD")

    switch (shift) {
      case 0:
        return `${t('today')}${!isOpen(ymd) ? ` – ${t('closed')}` : ""}`
      case 1:
        return `${t('tomorrow')}${!isOpen(ymd) ? ` – ${t('closed')}` : ""}`
      default:
        return `${t(day.format("dddd").toLowerCase())} – ${!isOpen(ymd) ? `${t('closed')}` : `${day.format("DD/MM/YYYY")}`}`
    }
  }

  React.useEffect(() => {
    if (isOpen(fieldProps.value)) return

    // set first day available as selected value
    for (let shift = 0; shift < scope.length; shift++) {
      const day = dayjs().add(shift, "day").format("YYYY-MM-DD")
      if (isOpen(day)) {
        setValue(day)
        break
      }
    }
  }, [])

  return (
    <Select {...fieldProps}>
      {scope.map((shift) =>
        <option
          key={shift}
          value={dayjs().add(shift, 'd').format("YYYY-MM-DD")}
          disabled={!isOpen(dayjs().add(shift, 'd').format("YYYY-MM-DD"))}
        >
          {optionLabel(shift)}
        </option>
      )}
    </Select>
  )
}
