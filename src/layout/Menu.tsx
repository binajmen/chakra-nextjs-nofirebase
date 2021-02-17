import * as React from 'react'
import useTranslation from 'next-translate/useTranslation'

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
} from "@chakra-ui/react"

import { FaBars, FaLock, FaSitemap, FaShoppingBasket, FaHeart, FaUserCog, FaHandsHelping } from 'react-icons/fa'

import Languages from './Languages'

const links = [
    { label: "menu-connect", icon: <FaLock />, color: 'primary', variant: "solid" },
    // { label: "menu-categories", icon: <FaSitemap />, color: 'primary', variant: "ghost" },
    { label: "menu-favorites", icon: <FaHeart />, color: 'primary', variant: "ghost" },
    { label: "menu-basket", icon: <FaShoppingBasket />, color: 'primary', variant: "ghost" },
    { label: "menu-account", icon: <FaUserCog />, color: 'primary', variant: "ghost" },
]

export default function Menu() {
    const { t } = useTranslation('common')
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()

    return (
        <>
            <Button ref={btnRef} leftIcon={<FaBars />} color="white" variant="ghost" onClick={onOpen}>
                {t('menu-header')}
            </Button>
            <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay>
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>{t('menu-header')}</DrawerHeader>

                        <DrawerBody>
                            <VStack w="full" align="stretch" spacing={4}>
                                {links.map((link, index) =>
                                    <Button key={index} leftIcon={link.icon} colorScheme={link.color} variant={link.variant}>{t(link.label)}</Button>
                                )}
                            </VStack>
                        </DrawerBody>

                        <DrawerFooter>
                            <VStack w="full" align="stretch" spacing={4}>
                                <Button leftIcon={<FaHandsHelping />} colorScheme="primary" variant="ghost">{t('support')}</Button>
                                <Languages />
                                <HStack justifyContent="center" divider={<StackDivider borderColor="primary.700" />}>
                                    <Link color="primary.700">{t('about-us')}</Link>
                                    <Link color="primary.700">{t('privacy')}</Link>
                                </HStack>
                            </VStack>
                        </DrawerFooter>
                    </DrawerContent>
                </DrawerOverlay>
            </Drawer>
        </>
    )
}