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
    Text,
    useDisclosure,
} from "@chakra-ui/react"

import { FaBars, FaLock, FaSitemap, FaShoppingBasket, FaHeart, FaUserCog } from 'react-icons/fa'

const links = [
    { label: "menu-connect", icon: <FaLock />, color: 'secondary', variant: "solid" },
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
            <Button ref={btnRef} leftIcon={<FaBars />} colorScheme="black" variant="outline" onClick={onOpen}>
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
                            <VStack align="stretch" spacing={4}>
                                {links.map((link, index) =>
                                    <Button key={index} leftIcon={link.icon} colorScheme={link.color} variant={link.variant}>{t(link.label)}</Button>
                                )}
                            </VStack>
                        </DrawerBody>

                        <DrawerFooter>
                            <Text>{t('about-us')}</Text>
                        </DrawerFooter>
                    </DrawerContent>
                </DrawerOverlay>
            </Drawer>
        </>
    )
}