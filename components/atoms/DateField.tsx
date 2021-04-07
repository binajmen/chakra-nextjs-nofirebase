import * as React from 'react'
import useTranslation from 'next-translate/useTranslation'
import dayjs from 'dayjs'
import { FieldInputProps } from 'formik'

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

  function isOpen(shift: number) {
    const day = dayjs().add(shift, "day").format("ddd").toLowerCase()

    if (schedule[day].length === 0 || schedule[day].length % 2 !== 0) {
      return false
    } else if (shift === 0) {
      return hasRemainingIntervalsToday(schedule[day], interval)
    } else {
      return true
    }
  }

  function dayLongName(shift: number) {
    return dayjs().add(shift, "day").format("dddd").toLowerCase()
  }

  function optionLabel(shift: number) {
    switch (shift) {
      case 0:
        return `${t('today')}${!isOpen(shift) ? ` – ${t('closed')}` : ""}`
      case 1:
        return `${t('tomorrow')}${!isOpen(shift) ? ` – ${t('closed')}` : ""}`
      default:
        return `${t(dayLongName(shift))} – ${!isOpen(shift) ? `${t('closed')}` : `${dayjs().add(shift, 'd').format("DD/MM/YYYY")}`}`
    }
  }

  React.useEffect(() => {
    // set first day available as selected value
    for (let shift = 0; shift < scope.length; shift++) {
      if (isOpen(shift)) {
        setValue(dayjs().add(shift, 'd').format("YYYY-MM-DD"))
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
          disabled={!isOpen(shift)}
        >
          {optionLabel(shift)}
        </option>
      )}
    </Select>
  )
}
