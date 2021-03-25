import * as React from 'react'
import * as Yup from 'yup'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { Formik, Form, Field, FieldProps } from 'formik'
dayjs.extend(customParseFormat)

import {
  Box,
  Stack,
  Center,
  Heading,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Input,
  Select,
  useToast
} from '@chakra-ui/react'
import { FaSave } from 'react-icons/fa'

import Button from '@/components/atoms/Button'
import CentsPriceField from '@/components/atoms/CentsPriceField'
import WeekdaysField from '@/components/atoms/WeekdaysField'

import type { Event } from '@/types/catalog'

import { DAYS } from '@/helpers/constants'

const initialValues: Event = {
  name: "",
  description: "",
  type: "show",
  value: 0,
  days: [],
  start: "",
  end: "",
  categoryIds: [],
  productIds: []
}

type EventFormProps = {
  event?: Event
  save: (event: Event) => Promise<any> | null
}

export default function EventForm({ event, save }: EventFormProps) {
  const { t } = useTranslation('admin')
  const toast = useToast()
  const router = useRouter()
  const { placeId } = router.query

  return (
    <Box>
      <Heading mb="6">{t('event')} – {!event ? t('common:new') : event.name}</Heading>
      <Formik
        initialValues={!event ? initialValues : event}
        validationSchema={Yup.object({
          name: Yup.string().required(),
          description: Yup.string().required(),
          type: Yup.string().oneOf(["hide", "show", "price"]),
          value: Yup.number().min(0).required(),
          days: Yup.array().of(Yup.string().oneOf(DAYS)).min(1),
          start: Yup.string().matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, "Format: HH:MM").required(),
          end: Yup.string().matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, "Format: HH:MM").required()
            .test("is-greater", "end time should be greater", (value, context) => {
              return dayjs(value, "HH:mm").isAfter(dayjs(context.parent.start, "HH:mm"))
            }),
          // categoryIds
          // productIds
        })}
        onSubmit={(values, actions) => {
          const { name, description, type, value, days, start, end, categoryIds, productIds } = values

          save({ name, description, type, value: type === "price" ? value : 0, days, start, end, categoryIds, productIds })!
            .then(() => toast({
              description: t('changes-saved'),
              status: "success"
            }))
            .catch((error) => toast({
              description: error.message,
              status: "error"
            }))

          actions.setSubmitting(false)

          router.push({
            pathname: "/manage/[placeId]/modifiers",
            query: { placeId }
          })
        }}
      >
        {(props) => (
          <Form>
            <Stack direction="column" spacing="6">
              <Field name="name">
                {({ field, form, meta }: FieldProps) => (
                  <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                    <FormLabel htmlFor="name">{t('name')}</FormLabel>
                    <Input {...field} id="name" placeholder="" />
                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="description">
                {({ field, form, meta }: FieldProps) => (
                  <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                    <FormLabel htmlFor="description">{t('description')}</FormLabel>
                    <Input {...field} id="description" placeholder="" />
                    <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="type">
                {({ field, form, meta }: FieldProps) => (
                  <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                    <FormLabel htmlFor="type">{t('type')}</FormLabel>
                    <Select {...field} id="type" defaultValue="show">
                      <option value="show">{t('show')}</option>
                      <option value="hide">{t('hide')}</option>
                      <option value="price">{t('price')}</option>
                    </Select>
                    <FormErrorMessage>{form.errors.type}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              {props.values.type === "price" &&
                <Field name="value">
                  {({ field, form, meta }: FieldProps) => (
                    <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                      <FormLabel htmlFor="price">{t('price')}</FormLabel>
                      <CentsPriceField
                        {...field}
                        id="price"
                        onPrice={(value) => {
                          form.setFieldValue("price", value)
                        }} />
                      <FormHelperText>100 = 1€</FormHelperText>
                      <FormErrorMessage>{form.errors.price}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              }
              <Field name="days">
                {(formikProps: FieldProps) => (
                  <WeekdaysField
                    {...formikProps}
                    id="days"
                    label={t('days')}
                  />
                )}
              </Field>
              <Stack direction="row">
                <Field name="start">
                  {({ field, form, meta }: FieldProps) => (
                    <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                      <FormLabel htmlFor="start">{t('start')}</FormLabel>
                      <Input {...field} id="start" placeholder="08:00" />
                      <FormErrorMessage>{form.errors.start}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="end">
                  {({ field, form, meta }: FieldProps) => (
                    <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                      <FormLabel htmlFor="end">{t('end')}</FormLabel>
                      <Input {...field} id="end" placeholder="22:00" />
                      <FormErrorMessage>{form.errors.end}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </Stack>
              <Center>
                <Button type="submit" leftIcon={<FaSave />} isLoading={props.isSubmitting}>{t('save')}</Button>
              </Center>
            </Stack>
          </Form>
        )}
      </Formik>

    </Box>
  )
}
