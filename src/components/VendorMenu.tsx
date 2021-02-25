import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

import { VStack } from '@chakra-ui/react'

import { FaCog, FaBuilding, FaClock, FaRegCalendarCheck, FaFolderOpen, FaDrumstickBite, FaFolder, FaTag } from 'react-icons/fa'

import ButtonLink from './ButtonLink'

const items = [
    { label: "general", pathname: "/vendor/[id]", icon: <FaBuilding /> },
    { label: "settings", pathname: "/vendor/[id]/settings", icon: <FaCog /> },
    { label: "opening", pathname: "/vendor/[id]/opening", icon: <FaClock /> },
    { label: "categories", pathname: "/vendor/[id]/categories", icon: <FaFolderOpen /> },
    { label: "products", pathname: "/vendor/[id]/products", icon: <FaDrumstickBite /> },
    { label: "events", pathname: "/vendor/[id]/events", icon: <FaRegCalendarCheck /> },
]

export default function VendorMenu() {
    const { t } = useTranslation('common')
    const router = useRouter()
    const { pathname, query } = router

    console.log(router)

    return (
        <VStack w="full" align="stretch" spacing={3}>
            {items.map((item, index) => {
                const isActive = pathname === item.pathname
                return (
                    <ButtonLink key={index}
                        pathname={item.pathname}
                        query={query}
                        leftIcon={item.icon}
                        color="gray.900"
                        variant={isActive ? 'solid' : 'ghost'}
                        colorScheme={isActive ? 'primary' : 'gray'}
                        justifyContent="left"
                    >{t(item.label)}</ButtonLink>
                )
            })}
        </VStack>
    )
}
