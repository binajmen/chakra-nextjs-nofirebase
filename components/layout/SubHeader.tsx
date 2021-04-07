import * as React from "react"
import useTranslation from "next-translate/useTranslation"

import {
  Flex,
  Box,
  Stack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  IconButton,
  Heading,
  Text,
  Badge,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Checkbox,
  useBreakpointValue,
  useDisclosure
} from "@chakra-ui/react"
import { FaSave, FaTimes, FaSlidersH, FaEdit, FaChevronDown, FaCheckCircle, FaStoreAlt, FaWalking, FaShippingFast, FaMapMarkedAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa"

import useWindowSize from "@/hooks/useWindowSize"
import TagsField from "@/components/atoms/TagsField"
import AlertDialog from "@/components/molecules/AlertDialog"
import DateTimeDrawer from "@/components/shared/DateTimeDrawer"
import { useStoreState, useStoreActions } from "@/store/hooks"
import { METHODS, ONSITE, COLLECT, CUISINES, TAGS } from "@/helpers/constants"

import DateTimeForm from "../shared/DateTimeDrawer"

export type SubHeaderFormat = "filters" | "datetime" | "hide"

type SubHeaderProps = {
  subHeader: SubHeaderFormat
}

const methodIcon: any = {
  onsite: FaStoreAlt,
  collect: FaWalking,
  delivery: FaShippingFast,
  geolocation: FaMapMarkedAlt,
}

export default function SubHeader({
  subHeader
}: SubHeaderProps) {
  if (subHeader === "filters") {
    return (
      <Flex justify={["space-between", "flex-end"]} alignItems="center" p="2">
        <Filters />
        <Methods withLabel={true} />
      </Flex>
    )
  } else if (subHeader === "datetime") {
    return (
      <Flex justify={["space-between", "flex-end"]} alignItems="center" p="2">
        <MethodDetails />
        <Methods withLabel={false} />
      </Flex>
    )
  } else { // subHeader === "hide"
    return null
  }
}

type MethodsProps = {
  withLabel: boolean
}

function Methods({ withLabel }: MethodsProps) {
  const { t } = useTranslation("common")
  const alert = useDisclosure()
  const isLarge = useBreakpointValue({ base: false, sm: true })

  const currentMethod = useStoreState(state => state.order.method)
  const setMethod = useStoreActions(actions => actions.order.setMethod)
  const basketIsEmpty = useStoreState(state => state.basket.isEmpty)
  const clearBasket = useStoreActions(actions => actions.basket.clearBasket)
  const [tempMethod, setTempMethod] = React.useState("")

  function updateMethod(method: string, force: boolean = false) {
    if (method === currentMethod)
      return

    if (force || basketIsEmpty) {
      setMethod(method)
      clearBasket()
      setTempMethod("")
      alert.onClose()
    } else {
      setTempMethod(method)
      alert.onOpen()
    }
  }

  return (
    <React.Fragment>
      <Menu autoSelect={false}>
        <MenuButton
          as={Button}
          color="black"
          colorScheme="primary"
          rightIcon={<FaChevronDown />}>
          <Stack direction="row" alignItems="center">
            <Icon as={methodIcon[currentMethod]}></Icon>
            {(isLarge || withLabel) && <Text>{t(currentMethod as string)}</Text>}
          </Stack>
        </MenuButton>
        <MenuList>
          {METHODS.map(method =>
            <MenuItem key={method} onClick={() => updateMethod(method)}>
              <Stack direction="column">
                <Stack direction="row" alignItems="center">
                  <Icon as={methodIcon[method]}></Icon>
                  <Heading size="md">{t(method)}</Heading>
                  {method === currentMethod && <Icon as={FaCheckCircle} color="green.300"></Icon>}
                </Stack>
                <Text fontSize="sm">{t(`${method}-desc`)}</Text>
              </Stack>
            </MenuItem>
          )}
        </MenuList>
      </Menu>

      <AlertDialog
        header="Votre panier va être vidé !"
        body="En changeant de menu, votre panier sera vidé"
        isOpen={alert.isOpen}
        onCancel={alert.onClose}
        onConfirm={() => updateMethod(tempMethod, true)}
      />
    </React.Fragment>
  )
}

function Filters() {
  const { t } = useTranslation("common")
  const { height } = useWindowSize()
  const drawer = useDisclosure()

  const filters = useStoreState(state => state.ui.filters)
  const filtersCount = useStoreState(state => state.ui.filtersCount)
  const setFilters = useStoreActions(actions => actions.ui.setFilters)

  return (
    <React.Fragment>
      <Button
        colorScheme="white"
        variant="ghost"
        leftIcon={<FaSlidersH />}
        rightIcon={filtersCount ? <Badge>{filtersCount}</Badge> : undefined}
        onClick={drawer.onOpen}
      >
        {t("filters")}
      </Button>

      <Drawer placement="bottom" isOpen={drawer.isOpen} onClose={drawer.onClose}>
        <DrawerOverlay>
          <DrawerContent maxH={height}>
            <DrawerCloseButton />

            <DrawerHeader>
              {t("filters")}
            </DrawerHeader>

            <DrawerBody>
              <Stack direction="column" spacing="6">
                <Checkbox
                  isChecked={filters.open}
                  onChange={() => setFilters({ open: !filters.open })}
                >
                  {t("filter-open")}
                </Checkbox>

                <Checkbox
                  isChecked={filters.favorites}
                  onChange={() => setFilters({ favorites: !filters.favorites })}
                >
                  {t("filter-favorites")}
                </Checkbox>

                <Box>
                  <Stack direction="row" alignItems="center" mb="3">
                    <Heading size="md">{t("cuisines")}</Heading>
                    {filters.cuisines.length > 0 && <Text size="sm">({filters.cuisines.length}/3)</Text>}
                    {filters.cuisines.length > 0 &&
                      <Button
                        size="xs"
                        variant="ghost"
                        leftIcon={<FaTimes />}
                        onClick={() => setFilters({ cuisines: [] })}
                      >{t("clear")}</Button>
                    }
                  </Stack>
                  <TagsField
                    allTags={CUISINES.sort((a, b) => t(a).localeCompare(t(b)))}
                    tags={filters.cuisines}
                    limit={3}
                    onTag={(cuisines: string[]) => setFilters({ cuisines })}
                  />
                </Box>

                <Box>
                  <Stack direction="row" alignItems="center" mb="3">
                    <Heading size="md">{t("keywords")}</Heading>
                    {filters.keywords.length > 0 && <Text size="sm">({filters.keywords.length}/5)</Text>}
                    {filters.keywords.length > 0 &&
                      <Button
                        size="xs"
                        variant="ghost"
                        leftIcon={<FaTimes />}
                        onClick={() => setFilters({ keywords: [] })}
                      >{t("clear")}</Button>
                    }
                  </Stack>
                  <TagsField
                    allTags={TAGS.sort((a, b) => t(a).localeCompare(t(b)))}
                    tags={filters.keywords}
                    limit={5}
                    onTag={(keywords: string[]) => setFilters({ keywords })}
                  />
                </Box>
              </Stack>
            </DrawerBody>

            <DrawerFooter>
              <Button
                color="black"
                colorScheme="primary"
                leftIcon={<FaTimes />}
                onClick={drawer.onClose}
              >
                {t("close")}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </React.Fragment>
  )
}

function MethodDetails() {
  const { t } = useTranslation("common")
  const { height } = useWindowSize()
  const drawer = useDisclosure()
  const changeDateTime = useDisclosure()
  const changeAddress = useDisclosure()

  const currentMethod = useStoreState(state => state.order.method)

  return (
    <React.Fragment>
      <Button
        colorScheme="white"
        variant="ghost"
        rightIcon={<FaEdit />}
        onClick={drawer.onOpen}
      >
        <HumanReadableDateTime />
      </Button>

      <Drawer placement="bottom" isOpen={drawer.isOpen} onClose={drawer.onClose}>
        <DrawerOverlay>
          <DrawerContent maxH={height}>
            <DrawerCloseButton />

            <DrawerHeader>
              {t(currentMethod)}
            </DrawerHeader>

            <DrawerBody>
              {currentMethod === ONSITE && <Text>{t("always-now")}</Text>}
              {currentMethod !== ONSITE &&
                <Stack direction="column" spacing="6">
                  <Flex justify="space-between" alignItems="center">
                    <Stack direction="row" alignItems="center" spacing="3">
                      <Icon as={FaClock} boxSize={5} />
                      <HumanReadableDateTime />
                    </Stack>
                    <IconButton aria-label="change" icon={<FaEdit />} onClick={changeDateTime.onOpen} />
                    <DateTimeDrawer isOpen={changeDateTime.isOpen} onClose={changeDateTime.onClose} />
                  </Flex>

                  <Flex justify="space-between" alignItems="center">
                    <Stack direction="row" alignItems="center" spacing="3">
                      <Icon as={FaMapMarkerAlt} boxSize={5} />
                      <Text>Rue des Faines 25, 1000 Bruxelles</Text>
                    </Stack>
                    <IconButton aria-label="change" icon={<FaEdit />}></IconButton>
                  </Flex>
                </Stack>
              }
            </DrawerBody>

            <DrawerFooter>
              <Button
                color="black"
                colorScheme="primary"
                leftIcon={<FaTimes />}
                onClick={drawer.onClose}
              >
                {t("close")}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </React.Fragment>
  )
}

function HumanReadableDateTime() {
  const { t } = useTranslation("common")
  const humanReadableDateTime = useStoreState(state => state.order.humanReadableDateTime)

  return (
    <Stack direction="row" spacing="1">
      <Text>{t(humanReadableDateTime.date.toLowerCase())}</Text>
      {humanReadableDateTime.time && <Text>– {humanReadableDateTime.time}</Text>}
    </Stack>
  )
}

type DrawerProps = {
  isOpen: boolean
  onClose: () => void
}

// function ChangeDateTime({ isOpen, onClose }: DrawerProps) {
//   const { t } = useTranslation("common")
//   const { height } = useWindowSize()

//   const currentMethod = useStoreState(state => state.order.method)

//   function onSave() {
//     onClose()
//   }

//   return (
//     <Drawer placement="bottom" isOpen={isOpen} onClose={onClose}>
//       <DrawerOverlay>
//         <DrawerContent maxH={height}>
//           <DrawerCloseButton />

//           <DrawerHeader>
//             {t("date-and-time")}
//           </DrawerHeader>

//           <DrawerBody>
//             <DateTimeForm

//             />
//           </DrawerBody>

//           <DrawerFooter>
//             <Button
//               color="black"
//               colorScheme="primary"
//               leftIcon={<FaSave />}
//               onClick={onSave}
//             >
//               {t("save")}
//             </Button>
//           </DrawerFooter>
//         </DrawerContent>
//       </DrawerOverlay>
//     </Drawer>
//   )
// }
