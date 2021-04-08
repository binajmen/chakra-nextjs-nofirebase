import * as React from "react"
import useTranslation from "next-translate/useTranslation"
import { useAuthUser } from "next-firebase-auth"

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  HStack,
  StackDivider,
  Link,
  IconButton,
  useDisclosure,
  useBreakpointValue
} from "@chakra-ui/react"

import { FaBars, FaSignInAlt, FaSignOutAlt, FaUserCircle, FaSitemap, FaShoppingBasket, FaHeart, FaUserCog, FaLocationArrow, FaStoreAlt, FaHandsHelping, FaReceipt } from "react-icons/fa"

import useAuthClaims from "@/hooks/useAuthClaims"
import useWindowSize from "@/hooks/useWindowSize"
import NextButton from "@/components/atoms/NextButton"

import Languages from "./Languages"

export default function Menu() {
  const drawer = useDisclosure()
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  return (
    <React.Fragment>
      <MenuButton drawer={drawer} buttonRef={buttonRef} />
      <MenuDrawer drawer={drawer} buttonRef={buttonRef} />
    </React.Fragment>
  )
}

type MenuProps = {
  drawer: ReturnType<typeof useDisclosure>
  buttonRef: React.RefObject<HTMLButtonElement>
}

function MenuButton({ drawer, buttonRef }: MenuProps) {
  const { t } = useTranslation("common")
  const isMobile = useBreakpointValue({ base: true, md: false })

  if (isMobile) {
    return (
      <IconButton
        ref={buttonRef}
        aria-label="open-menu"
        icon={<FaBars />}
        color="black"
        colorScheme="primary"
        variant="solid"
        onClick={drawer.onOpen} />
    )
  } else {
    return (
      <Button
        ref={buttonRef}
        leftIcon={<FaBars />}
        color="black"
        colorScheme="primary"
        variant="solid"
        onClick={drawer.onOpen}
      >
        {t("open-menu")}
      </Button>
    )
  }
}

function MenuDrawer({ drawer, buttonRef }: MenuProps) {
  const { t } = useTranslation("common")
  const { height } = useWindowSize()

  return (
    <Drawer
      isOpen={drawer.isOpen}
      placement="right"
      onClose={drawer.onClose}
      finalFocusRef={buttonRef}
    >
      <DrawerOverlay>
        <DrawerContent heigth={height}>
          <DrawerCloseButton />
          <DrawerHeader>{t("menu-header")}</DrawerHeader>

          <DrawerBody>
            <VStack w="full" align="stretch" spacing={4}>
              <AccountButton />
              <MenuItems />
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <VStack w="full" align="stretch" spacing={4}>
              {/* <Geolocation /> */}
              <SignOutButton />
              <SupportButton />
              <Languages />
              <FooterButtons />
            </VStack>
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  )
}

function AccountButton() {
  const { t } = useTranslation("common")
  const user = useAuthUser()
  const isSignedIn = user.id !== null
  const claims = useAuthClaims()

  React.useEffect(() => {
    console.log(claims)
  }, [claims])

  if (isSignedIn) {
    return (
      <React.Fragment>
        <NextButton
          leftIcon={<FaUserCircle />}
          colorScheme="primary"
          pathname="/account"
        >
          {t("menu-account")}
        </NextButton>
        {claims.manager &&
          <NextButton
            leftIcon={<FaStoreAlt />}
            color="white"
            colorScheme="red"
            pathname="/manage"
          >
            {t("menu-manager")}
          </NextButton>
        }
      </React.Fragment>
    )
  } else {
    return (
      <NextButton
        leftIcon={<FaSignInAlt />}
        colorScheme="primary"
        pathname="/account/signin"
      >
        {t("sign-in")}
      </NextButton>
    )
  }
}

const MENU_ITEMS = [
  { label: "menu-favorites", to: "/favorites", icon: <FaHeart />, color: "gray", variant: "ghost" },
  // { label: "menu-basket", to: "/basket", icon: <FaShoppingBasket />, color: "gray", variant: "ghost" },
  { label: "menu-orders", to: "/orders", icon: <FaReceipt />, color: "gray", variant: "ghost" },
]

function MenuItems() {
  const { t } = useTranslation("common")

  return (
    <React.Fragment>
      {MENU_ITEMS.map((item, index) =>
        <NextButton
          key={index}
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
  const isSignedIn = user.id !== null

  if (isSignedIn) {
    return (
      <Button
        leftIcon={<FaSignOutAlt />}
        colorScheme="red"
        variant="ghost"
        onClick={user.signOut}
      >
        {t("sign-out")}
      </Button>
    )
  } else {
    return null
  }
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
    <HStack justify="center" divider={<StackDivider borderColor="black" />}>
      <Link color="black">{t("about-us")}</Link>
      <Link color="black">{t("privacy")}</Link>
    </HStack>
  )
}
