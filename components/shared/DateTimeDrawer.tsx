import * as React from "react"
import * as Yup from "yup"
import useTranslation from "next-translate/useTranslation"
import { useRouter } from "next/router"
import { Formik, Form, Field, FieldProps } from "formik"
import { useDocument } from "@nandorojo/swr-firestore"

import {
  Stack,
  Text,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react"
import { FaSave } from "react-icons/fa"

import { useStoreState, useStoreActions } from "@/store/hooks"
import { useStoreRehydrated } from "easy-peasy"

import LoadingOverlay from "@/components/atoms/LoadingOverlay"
import DateField from "@/components/atoms/DateField"
import TimeIntervalField from "@/components/atoms/TimeIntervalField"
import useWindowSize from "@/hooks/useWindowSize"
import { COLLECT } from "@/helpers/constants"

import type { Place } from "@/types/place"

type DrawerProps = {
  isOpen: boolean
  onClose: () => void
}

export default function DateTimeDrawer({ isOpen, onClose }: DrawerProps) {
  const { t } = useTranslation("common")
  const { height } = useWindowSize()
  const isRehydrated = useStoreRehydrated()
  const router = useRouter()

  const currentMethod = useStoreState(state => state.order.method)
  const currentDate = useStoreState(state => state.order.date)
  const currentTime = useStoreState(state => state.order.time)
  const order = useStoreActions(actions => actions.order)

  const interval = currentMethod === COLLECT ? 15 : 30

  const place = useDocument<Place>(`places/${router.query.placeId}`)

  if (!isRehydrated || place.loading) {
    return <LoadingOverlay />
  } else if (place.error) {
    return <Text>Error: {JSON.stringify(place.error)}</Text>
  } else if (place.data) {
    return (
      <Drawer placement="bottom" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent maxH={height}>
            <DrawerCloseButton />

            <DrawerHeader>
              {t("date-and-time")}
            </DrawerHeader>

            <DrawerBody>
              <Formik
                initialValues={{
                  date: currentDate,
                  time: currentTime
                }}
                validationSchema={Yup.object().shape({
                  date: Yup.string().required(),
                  time: Yup.string().required()
                })}
                onSubmit={(values) => {
                  order.setDate(values.date)
                  order.setTime(values.time)
                  onClose()
                }}
              >
                {(props) => (
                  <Form id="datetime">
                    <Stack direction="column" spacing="6">
                      <Field name="date">
                        {({ field, form, meta }: FieldProps) => (
                          <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                            <FormLabel htmlFor="date">{t("date")}</FormLabel>
                            <DateField
                              {...field}
                              id="date"
                              date={field.value}
                              schedule={place.data!.opening[currentMethod]}
                              interval={interval}
                              setValue={(value) => form.setFieldValue("date", value)}
                            />
                            <FormErrorMessage>{form.errors.date}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="time">
                        {({ field, form, meta }: FieldProps) => (
                          <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                            <FormLabel htmlFor="time">{t("time")}</FormLabel>
                            <TimeIntervalField
                              {...field}
                              id="time"
                              date={props.values.date}
                              schedule={place.data!.opening[currentMethod]}
                              interval={interval}
                              setValue={(value) => form.setFieldValue("time", value)}
                            />
                            <FormErrorMessage>{form.errors.time}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </Stack>
                  </Form>
                )}
              </Formik>
            </DrawerBody>

            <DrawerFooter>
              <Button
                type="submit"
                form="datetime"
                color="black"
                colorScheme="primary"
                leftIcon={<FaSave />}
              >
                {t("save")}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    )
  } else {
    return null
  }
}
