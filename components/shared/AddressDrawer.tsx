import * as React from "react"
import * as Yup from "yup"
import useTranslation from "next-translate/useTranslation"
import { Formik, Form, Field, FieldProps } from "formik"

import {
  Box,
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
  RadioGroup,
  Radio,
} from "@chakra-ui/react"
import { FaSave } from "react-icons/fa"

import { useStoreState, useStoreActions } from "@/store/hooks"
import { useStoreRehydrated } from "easy-peasy"

import LoadingOverlay from "@/components/atoms/LoadingOverlay"
import useWindowSize from "@/hooks/useWindowSize"

type DrawerProps = {
  isOpen: boolean
  onClose: () => void
}

export default function AddressDrawer({ isOpen, onClose }: DrawerProps) {
  const { t } = useTranslation("common")
  const { height } = useWindowSize()
  const isRehydrated = useStoreRehydrated()

  const locations = useStoreState(state => state.user.locations)
  const addrIndex = useStoreState(state => state.user.addrIndex)
  const user = useStoreActions(actions => actions.user)

  React.useEffect(() => {
    const unsubscribe = user.onUser()
    return () => unsubscribe()
  }, [])

  if (!isRehydrated) {
    return <LoadingOverlay />
  }

  return (
    <Drawer placement="bottom" isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent maxH={height}>
          <DrawerCloseButton />

          <DrawerHeader>
            {t("address")}
          </DrawerHeader>

          <DrawerBody>
            <Formik
              initialValues={{
                locations: locations,
                addrIndex: `${addrIndex > -1 ? addrIndex : locations.length > 0 ? 0 : -1}`,
              }}
              validationSchema={Yup.object().shape({
                addrIndex: Yup.string().required()
              })}
              onSubmit={(values) => {
                user.setAddrIndex(parseInt(values.addrIndex, 10))
                onClose()
              }}
            >
              {(props) => (
                <Form id="address-form">
                  <Stack direction="column" spacing="6">
                    <Field name="addrIndex">
                      {({ field, form, meta }: FieldProps) => (
                        <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                          <RadioGroup value={field.value}>
                            <Stack direction="column">
                              {props.values.locations.map((location, index, array) =>
                                <React.Fragment key={index}>
                                  <Radio
                                    value={`${index}`}
                                    onChange={() => form.setFieldValue("addrIndex", `${index}`)}
                                  >
                                    <Box pl="3">
                                      {location.address.split(",").map(slice => <Text>{slice}</Text>)}
                                    </Box>
                                  </Radio>
                                  {index < array.length - 1 && <hr />}
                                </React.Fragment>
                              )}
                            </Stack>
                          </RadioGroup>
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
              form="address-form"
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
}
