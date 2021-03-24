import * as React from 'react'
import useTranslation from 'next-translate/useTranslation'
import { FieldProps } from 'formik'

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  ButtonGroup
} from '@chakra-ui/react'

import Button from '@/components/atoms/Button'

export type WeekdaysFieldProps = FieldProps & {
  id: string
  label: string
  helperText?: string
}

export default function WeekdaysField({
  field, form, meta, // Formik FieldProps
  id, label, helperText // Component Props
}: WeekdaysFieldProps) {
  const { t } = useTranslation('common')
  const week = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

  function onChange(day: string) {
    if (field.value.includes(day)) {
      form.setFieldValue(id, field.value.filter((d: string) => d !== day))
    } else {
      form.setFieldValue(id, [...field.value, day].sort((a, b) => week.indexOf(a) - week.indexOf(b)))
    }
  }

  return (
    <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <ButtonGroup>
        {week.map(day =>
          <Button
            key={day}
            variant={field.value.includes(day) ? "solid" : "outline"}
            colorScheme={field.value.includes(day) ? "primary" : "gray"}
            onClick={() => onChange(day)}
          >
            {t(day)}
          </Button>
        )}
      </ButtonGroup>
      {!!helperText && <FormHelperText>{helperText}</FormHelperText>}
      <FormErrorMessage>{form.errors[id]}</FormErrorMessage>
    </FormControl>
  )
}
