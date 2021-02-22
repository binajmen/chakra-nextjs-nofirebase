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
    useDisclosure,
    IconButton,
} from "@chakra-ui/react"

import { FaBars, FaSignInAlt, FaSignOutAlt, FaSitemap, FaShoppingBasket, FaHeart, FaUserCog, FaHandsHelping } from 'react-icons/fa'

import Languages from './Languages'
import Authentication from '../forms/Authentication'

const links = [
    // { label: "menu-categories", icon: <FaSitemap />, color: 'primary', variant: "ghost" },
    { label: "menu-favorites", icon: <FaHeart />, color: 'gray', variant: "ghost" },
    { label: "menu-basket", icon: <FaShoppingBasket />, color: 'gray', variant: "ghost" },
]

export default function Menu() {
    const { t } = useTranslation('common')
    const { isOpen, onOpen, onClose } = useDisclosure()
    const login = useDisclosure()
    const buttonRef = React.useRef<any>() // TOFIX: use correct type
    const authUser = useAuthUser()
    const isAuthed = authUser.id !== null

    return (
        <>
            <Button ref={buttonRef} leftIcon={<FaBars />} textColor="black" colorScheme="primary" variant="ghost" onClick={onOpen}>
                {t('menu-header')}
            </Button>
            <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
                finalFocusRef={buttonRef}
            >
                <DrawerOverlay>
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>{t('menu-header')}</DrawerHeader>

                        <DrawerBody>
                            <VStack w="full" align="stretch" spacing={4}>
                                {!isAuthed && <>
                                    <Button leftIcon={<FaSignInAlt />} textColor="black" colorScheme="primary" variant="solid" onClick={login.onToggle}>{t('sign-in')}</Button>
                                    <Authentication modal={login} />
                                </>}
                                {isAuthed &&
                                    <NextLink href="/user">
                                        <Button leftIcon={<FaUserCog />} textColor="black" colorScheme="primary" variant="solid">{t('menu-account')}</Button>
                                    </NextLink>
                                }
                                {links.map((link, index) =>
                                    <Button key={index} leftIcon={link.icon} colorScheme={link.color} variant={link.variant}>{t(link.label)}</Button>
                                )}
                            </VStack>
                        </DrawerBody>

                        <DrawerFooter>
                            <VStack w="full" align="stretch" spacing={4}>
                                {isAuthed && <Button leftIcon={<FaSignOutAlt />} colorScheme="red" variant="ghost" onClick={authUser.signOut}>{t('sign-out')}</Button>}
                                <Button leftIcon={<FaHandsHelping />} colorScheme="gray" variant="ghost">{t('support')}</Button>
                                <Languages />
                                <HStack justifyContent="center" divider={<StackDivider borderColor="gray" />}>
                                    <Link color="gray">{t('about-us')}</Link>
                                    <Link color="gray">{t('privacy')}</Link>
                                </HStack>
                            </VStack>
                        </DrawerFooter>
                    </DrawerContent>
                </DrawerOverlay>
            </Drawer>
        </>
    )
}