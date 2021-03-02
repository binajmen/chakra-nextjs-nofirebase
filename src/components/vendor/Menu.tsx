import * as React from 'react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

import { Divider, VStack } from '@chakra-ui/react'
import { FaCog, FaBuilding, FaClock, FaRegCalendarCheck, FaFolderOpen, FaDrumstickBite, FaArrowLeft } from 'react-icons/fa'

import ButtonLink from '../ButtonLink'

const items = [
    { label: "general", pathname: "/vendor/[vendorId]", icon: <FaBuilding /> },
    { label: "settings", pathname: "/vendor/[vendorId]/settings", icon: <FaCog /> },
    { label: "opening", pathname: "/vendor/[vendorId]/opening", icon: <FaClock /> },
    { label: "categories", pathname: "/vendor/[vendorId]/categories", icon: <FaFolderOpen /> },
    // { label: "products", pathname: "/vendor/[vendorId]/products", icon: <FaDrumstickBite /> },
    // { label: "events", pathname: "/vendor/[vendorId]/events", icon: <FaRegCalendarCheck /> },
]

import type { Categories } from '../../types/category'

import { useStoreState } from '../../store/hooks'

export default function Menu() {
    const { t } = useTranslation('common')
    const router = useRouter()
    const { pathname, query: { vendorId } } = router

    const split = pathname.split('/')
    const active = split[3] === undefined ? 'general' : split[3]

    const order = useStoreState(state => state.categories.order)
    const categories = useStoreState(state => state.categories.list)

    return (
        <VStack w="full" align="stretch" spacing={3}>
            {items.map((item, index) => {
                const isActive = item.label === active
                return (
                    <>
                        <ButtonLink key={index}
                            pathname={item.pathname}
                            query={{ vendorId }}
                            leftIcon={item.icon}
                            color="gray.900"
                            variant={isActive ? 'solid' : 'ghost'}
                            colorScheme={isActive ? 'primary' : 'gray'}
                            justifyContent="left"
                        >{t(item.label)}</ButtonLink>
                        {isActive && item.label === 'categories' && order.map(catId => (
                            <ButtonLink key={catId}
                                pathname="/vendor/[vendorId]/categories/[catId]"
                                query={{ vendorId, catId }}
                                color="gray.900"
                                variant='ghost'
                                colorScheme='gray'
                                justifyContent="right"
                                fontStyle="italic"
                                pl={10}
                            >{categories[catId].name}</ButtonLink>
                        ))}
                    </>
                )
            })}
            <Divider />
            <ButtonLink
                pathname="/vendor"
                leftIcon={<FaArrowLeft />}
                variant='ghost'
                colorScheme='gray'
                justifyContent="left"
            >{t('back')}</ButtonLink>
        </VStack>
    )
}
