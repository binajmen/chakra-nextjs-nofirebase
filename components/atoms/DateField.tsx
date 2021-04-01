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

import { createTimeInterval } from '@/helpers/hours'

type DateFieldProps = FieldInputProps<string> & {
  id: string,
  openingHours: { [index: string]: string[] }
  setValue: (value: string) => void
}

export default function DateField({ openingHours, setValue, ...fieldProps }: DateFieldProps) {
  const { t } = useTranslation('checkout')
  const scope = [0, 1, 2, 3, 4, 5, 6]
  const now = dayjs()

  function isOpen(shift: number) {
    const dayOfWeek = now.add(shift, 'd').format("ddd").toLowerCase()

    if (openingHours[dayOfWeek].length === 0 || openingHours[dayOfWeek].length % 2 !== 0) {
      return false
    } else if (shift === 0) {
      const remainingIntervals = createTimeInterval(openingHours[dayOfWeek], 30, true)
      return remainingIntervals.length > 0
    } else {
      return true
    }
  }

  function dayLongName(shift: number) {
    return now.add(shift, 'd').format("dddd").toLowerCase()
  }

  function optionLabel(shift: number) {
    switch (shift) {
      case 0:
        return `${t('today')}${!isOpen(shift) ? ` – ${t('closed')}` : ""}`
      case 1:
        return `${t('tomorrow')}${!isOpen(shift) ? ` – ${t('closed')}` : ""}`
      default:
        return `${t(dayLongName(shift))} – ${!isOpen(shift) ? `${t('closed')}` : `${now.add(shift, 'd').format("DD/MM/YYYY")}`}`
    }
  }

  React.useEffect(() => {
    for (let shift = 0; shift < scope.length; shift++) {
      if (isOpen(shift)) {
        setValue(now.add(shift, 'd').format("YYYY-MM-DD"))
        break
      }
    }
  }, [])

  return (
    <Select {...fieldProps}>
      {scope.map((shift) =>
        <option
          key={shift}
          value={now.add(shift, 'd').format("YYYY-MM-DD")}
          disabled={!isOpen(shift)}
        >
          {optionLabel(shift)}
        </option>
      )}
    </Select>
  )
}
