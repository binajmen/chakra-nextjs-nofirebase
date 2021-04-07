import * as React from 'react'
import NextLink from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import { useAuthUser } from 'next-firebase-auth'

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

import { FaBars, FaSignInAlt, FaSignOutAlt, FaSitemap, FaShoppingBasket, FaHeart, FaUserCog, FaLocationArrow, FaHandsHelping, FaReceipt } from 'react-icons/fa'

import { useStoreState } from '@/store/hooks'

import Languages from '@/components/layout/Languages'
import Authentication from '@/forms/Authentication'
import Geolocation from '@/components/Geolocation'
import NextButton from '@/components/atoms/NextButton'

const links = [
  // { label: "menu-categories", icon: <FaSitemap />, color: 'primary', variant: "ghost" },
  // { label: "menu-favorites", to: "/favorites", icon: <FaHeart />, color: 'gray', variant: "ghost" },
  // { label: "menu-basket", to: "/basket", icon: <FaShoppingBasket />, color: 'gray', variant: "ghost" },
  { label: "menu-orders", to: "/orders", icon: <FaReceipt />, color: 'gray', variant: "ghost" },
]

type MenuProps = {
  withCover?: boolean
}

export default function Menu({ withCover = false }: MenuProps) {
  const { t } = useTranslation('common')
  const { isOpen, onOpen, onClose } = useDisclosure()

  const login = useDisclosure()
  const geoColor = useStoreState(state => state.geolocation.color)
  const isMobile = useBreakpointValue({ base: true, md: false })
  const buttonRef = React.useRef<any>() // TOFIX: use correct type
  const authUser = useAuthUser()
  const isAuthed = authUser.id !== null

  return (
    <>
      {isMobile ? (
        <IconButton aria-label="menu"
          icon={<FaBars />}
          textColor="gray.900"
          colorScheme="primary"
          variant={withCover ? "solid" : "ghost"}
          onClick={onOpen} />
      ) : (
        <Button ref={buttonRef}
          leftIcon={<FaBars />}
          textColor="gray.900"
          colorScheme="primary"
          variant={withCover ? "solid" : "ghost"}
          onClick={onOpen}
        >
          {t('menu-header')}
        </Button>
      )}
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={buttonRef}
      >
        <DrawerOverlay heigth="100% !important">
          <DrawerContent heigth="100% !important">
            <DrawerCloseButton />
            <DrawerHeader>{t('menu-header')}</DrawerHeader>

            <DrawerBody>
              <VStack w="full" align="stretch" spacing={4}>
                {!isAuthed && <>
                  <Button leftIcon={<FaSignInAlt />} textColor="gray.900" colorScheme="primary" variant="solid" onClick={login.onToggle}>{t('sign-in')}</Button>
                  <Authentication modal={login} />
                </>}
                {isAuthed &&
                  <NextLink href="/account">
                    <Button leftIcon={<FaUserCog />} textColor="gray.900" colorScheme="primary" variant="solid">{t('menu-account')}</Button>
                  </NextLink>
                }
                {links.map((link, index) =>
                  <NextButton key={index} leftIcon={link.icon} colorScheme={link.color} variant={link.variant} pathname={link.to}>{t(link.label)}</NextButton>
                )}
              </VStack>
            </DrawerBody>

            <DrawerFooter>
              <VStack w="full" align="stretch" spacing={4}>
                <Geolocation />
                {isAuthed && <Button leftIcon={<FaSignOutAlt />} colorScheme="red" variant="ghost" onClick={authUser.signOut}>{t('sign-out')}</Button>}
                <Button leftIcon={<FaHandsHelping />} colorScheme="gray" variant="ghost">{t('support')}</Button>
                <Languages />
                <HStack justifyContent="center" divider={<StackDivider borderColor="gray.900" />}>
                  <Link color="gray.900">{t('about-us')}</Link>
                  <Link color="gray.900">{t('privacy')}</Link>
                </HStack>
              </VStack>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  )
}