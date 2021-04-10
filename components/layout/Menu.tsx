import * as React from "react"
import useTranslation from "next-translate/useTranslation"
import { useAuthUser } from "next-firebase-auth"
import { useRouter } from "next/router"

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Stack,
  VStack,
  HStack,
  StackDivider,
  Link,
  IconButton,
  useDisclosure,
  useBreakpointValue
} from "@chakra-ui/react"

import { FaBars, FaSignInAlt, FaSignOutAlt, FaUserCircle, FaStoreAlt, FaHeart, FaHandsHelping, FaReceipt } from "react-icons/fa"

import useRouteChanged from "@/hooks/useRouteChanged"
import useAuthClaims from "@/hooks/useAuthClaims"
import useWindowSize from "@/hooks/useWindowSize"
import NextButton from "@/components/atoms/NextButton"

import Languages from "./Languages"
import { useStoreState } from "@/store/hooks"
import { nanoid } from "nanoid"

export default function Menu() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <React.Fragment>
      <MenuButton isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
      <MenuDrawer isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </React.Fragment>
  )
}

type MenuProps = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

function MenuButton({ isOpen, onOpen, onClose }: MenuProps) {
  const { t } = useTranslation("common")
  const isMobile = useBreakpointValue({ base: true, md: false })

  if (isMobile) {
    return (
      <IconButton
        aria-label="open-menu"
        icon={<FaBars />}
        color="black"
        colorScheme="primary"
        variant="solid"
        onClick={onOpen} />
    )
  } else {
    return (
      <Button
        leftIcon={<FaBars />}
        color="black"
        colorScheme="primary"
        variant="solid"
        onClick={onOpen}
      >
        {t("open-menu")}
      </Button>
    )
  }
}

function MenuDrawer({ isOpen, onOpen, onClose }: MenuProps) {
  const { t } = useTranslation("common")
  // const { height } = useWindowSize()

  // useRouteChanged(onClose)

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
    >
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{t("menu-header")}</DrawerHeader>

          <DrawerBody>
            <Stack direction="column" spacing="4">
              <AccountButton />
              <ManagerButton />
              <MenuItems />
            </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Stack w="full" direction="column" spacing="4">
              <SignOutButton />
              <SupportButton />
              <Languages />
              <FooterButtons />
            </Stack>
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  )
}

function AccountButton() {
  const { t } = useTranslation("common")
  const isLogged = useStoreState(state => state.user.isLogged)
  const router = useRouter()

  if (isLogged) {
    return (
      <NextButton
        leftIcon={<FaUserCircle />}
        color="black"
        colorScheme="primary"
        pathname="/account"
      >
        {t("menu-account")}
      </NextButton>
    )
  } else {
    return (
      <NextButton
        leftIcon={<FaSignInAlt />}
        color="black"
        colorScheme="primary"
        pathname={`/account/signin`}
        query={{ next: router.asPath }}
      >
        {t("sign-in")}
      </NextButton >
    )
  }
}

function ManagerButton() {
  const { t } = useTranslation("common")
  const isManager = useStoreState(state => state.user.claims.manager)

  return (
    <NextButton
      leftIcon={<FaStoreAlt />}
      color="white"
      colorScheme="red"
      pathname="/manage"
      hidden={!isManager}
    >
      {t("menu-manager")}
    </NextButton>
  )
}

const MENU_ITEMS = [
  { label: "menu-favorites", to: "/favorites", icon: <FaHeart />, color: "gray", variant: "ghost" },
]

function MenuItems() {
  const { t } = useTranslation("common")

  return (
    <React.Fragment>
      {MENU_ITEMS.map((item) =>
        <NextButton
          key={item.label}
          leftIcon={item.icon}
          colorScheme="gray"
          pathname={item.to}
        >
          {t(item.label)}
        </NextButton>
      )}
    </React.Fragment>
  )
}

function SignOutButton() {
  const { t } = useTranslation("common")
  const user = useAuthUser()
  const isLogged = useStoreState(state => state.user.isLogged)

  return (
    <Button
      leftIcon={<FaSignOutAlt />}
      colorScheme="red"
      variant="ghost"
      onClick={user.signOut}
      hidden={!isLogged}
    >
      {t("sign-out")}
    </Button>
  )
}

function SupportButton() {
  const { t } = useTranslation("common")

  return (
    <NextButton
      leftIcon={<FaHandsHelping />}
      colorScheme="gray"
      variant="ghost"
      pathname="/support"
    >
      {t("support")}
    </NextButton>
  )
}

function FooterButtons() {
  const { t } = useTranslation("common")

  return (
    <Stack direction="row" justify="center" divider={<StackDivider borderColor="black" />}>
      <Link color="black">{t("about-us")}</Link>
      <Link color="black">{t("privacy")}</Link>
    </Stack>
  )
}
