import * as React from 'react'
import useTranslation from 'next-translate/useTranslation'
import dayjs from 'dayjs'
import { FieldInputProps } from 'formik'

import {
  FormControl,
  FormLabel,
  Select
} from '@chakra-ui/react'

type DateFieldProps = FieldInputProps<string> & {
  id: string
}

export default function DateField(props: DateFieldProps) {
  const { t } = useTranslation('checkout')
  const scope = [0, 1, 2, 3, 4, 5, 6, 7]
  const now = dayjs()

  return (
    <Select {...props}>
      {scope.map((shift, index) => {
        if (shift === 0)
          return (
            <option key={index} value={now.format("YYYY-MM-DD")}>{t('today')}</option>
          )
        else if (shift === 1)
          return (
            <option key={index} value={now.add(1, 'd').format("YYYY-MM-DD")}>{t('tomorrow')}</option>
          )
        else
          return (
            <option key={index} value={now.add(shift, 'd').format("YYYY-MM-DD")}>
              {`${t(now.add(shift, 'd').format("dddd").toLowerCase())} – ${now.add(shift, 'd').format("DD/MM/YYYY")}`}
            </option>
          )
      })}
    </Select>
  )
}
