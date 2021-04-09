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
  VStack,
  HStack,
  StackDivider,
  Link,
  IconButton,
  useDisclosure,
  useBreakpointValue
} from "@chakra-ui/react"

import { FaBars, FaSignInAlt, FaSignOutAlt, FaUserCircle, FaHeart, FaHandsHelping, FaReceipt } from "react-icons/fa"

import useAuthClaims from "@/hooks/useAuthClaims"
import useWindowSize from "@/hooks/useWindowSize"
import NextButton from "@/components/atoms/NextButton"

import Languages from "./Languages"
import { useStoreState } from "@/store/hooks"
import { nanoid } from "nanoid"

export default function Menu() {
  const drawer = useDisclosure()

  return (
    <React.Fragment>
      <MenuButton drawer={drawer} />
      <MenuDrawer drawer={drawer} />
    </React.Fragment>
  )
}

type MenuProps = {
  drawer: ReturnType<typeof useDisclosure>
}

function MenuButton({ drawer }: MenuProps) {
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
        onClick={drawer.onOpen} />
    )
  } else {
    return (
      <Button
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

function MenuDrawer({ drawer }: MenuProps) {
  const { t } = useTranslation("common")
  const { height } = useWindowSize()

  if (!drawer.isOpen) {
    return null
  }

  return (
    <Drawer
      id={nanoid()}
      isOpen={drawer.isOpen}
      placement="right"
      onClose={drawer.onClose}
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
  const isLogged = useStoreState(state => state.user.isLogged)
  const user = useAuthUser()
  const router = useRouter()
  const isSignedIn = user.id !== null
  const claims = useAuthClaims()
  console.log("AccountButton")

  React.useEffect(() => {
    console.log(claims)
  }, [claims])

  function goToAccount() {
    router.push("/account")
  }

  // if (isLogged) {
  //   return (
  //     <Button
  //       leftIcon={<FaUserCircle />}
  //       colorScheme="primary"
  //       // pathname="/account"
  //       onClick={goToAccount}
  //     >
  //       {t("menu-account")}
  //     </Button>
  //   )
  // } else {
  //   return (
  //     <Button
  //       leftIcon={<FaSignInAlt />}
  //       colorScheme="primary"
  //       pathname={`/account/signin`}
  //     >
  //       {t("sign-in")}
  //     </Button>
  //   )
  // }
  if (isSignedIn) {
    return (
      <NextButton
        leftIcon={<FaUserCircle />}
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
        colorScheme="primary"
        pathname={`/account/signin`}
        query={{ next: router.asPath }}
      >
        {t("sign-in")}
      </NextButton >
    )
  }
}

// {claims.manager &&
//   <NextButton
//     leftIcon={<FaStoreAlt />}
//     color="white"
//     colorScheme="red"
//     pathname="/manage"
//   >
//     {t("menu-manager")}
//   </NextButton>
// }

const MENU_ITEMS = [
  { label: "menu-favorites", to: "/favorites", icon: <FaHeart />, color: "gray", variant: "ghost" },
  // { label: "menu-basket", to: "/basket", icon: <FaShoppingBasket />, color: "gray", variant: "ghost" },
  { label: "menu-orders", to: "/orders", icon: <FaReceipt />, color: "gray", variant: "ghost" },
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
