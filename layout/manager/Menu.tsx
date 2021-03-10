import * as React from 'react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { useDocument, useCollection } from '@nandorojo/swr-firestore'

import { Divider, VStack } from '@chakra-ui/react'
import { FaCog, FaBuilding, FaClock, FaRegCalendarCheck, FaFolderOpen, FaDrumstickBite, FaArrowLeft } from 'react-icons/fa'

import ButtonLink from '@/components/atoms/NextButton'

import type { Categories, Category, CategoryMeta } from '@/types/category'

import { useStoreState } from '@/store/hooks'

const items = [
  { label: "general", pathname: "/manage/[place]/", icon: <FaBuilding /> },
  { label: "settings", pathname: "/manage/[place]/settings", icon: <FaCog /> },
  { label: "opening", pathname: "/manage/[place]/opening", icon: <FaClock /> },
  { label: "categories", pathname: "/manage/[place]/categories", icon: <FaFolderOpen /> },
  // { label: "products", pathname: "/manage/[place]/products", icon: <FaDrumstickBite /> },
  // { label: "events", pathname: "/manage/[place]/events", icon: <FaRegCalendarCheck /> },
]

export default function Menu() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const pathname = router.pathname
  const place = router.query.place

  const split = pathname.split('/')
  const active = split[3] === undefined ? 'general' : split[3]

  return (
    <VStack w="full" align="stretch" spacing={3}>
      {items.map((item, index) => {
        const isActive = item.label === active
        return (
          <React.Fragment key={index}>
            <ButtonLink
              pathname={item.pathname}
              query={{ place }}
              leftIcon={item.icon}
              color="gray.900"
              variant={isActive ? 'solid' : 'ghost'}
              colorScheme={isActive ? 'primary' : 'gray'}
              justifyContent="left"
            >{t(item.label)}</ButtonLink>
            {isActive && item.label === 'categories' && <CategoriesMenu />}
          </React.Fragment>
        )
      })}
      <Divider />
      <ButtonLink
        pathname="/place"
        leftIcon={<FaArrowLeft />}
        variant='ghost'
        colorScheme='gray'
        justifyContent="left"
      >{t('back')}</ButtonLink>
    </VStack>
  )
}

function CategoriesMenu() {
  const router = useRouter()
  const place = router.query.place

  const { data: catArr } = useCollection<Category>(`places/${place}/categories`, { listen: true })
  const { data: meta } = useDocument<CategoryMeta>(`places/${place}/categories/_meta_`)
  const categories: Categories = catArr?.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {}) ?? {}

  if (meta?.order.length && catArr?.length) {
    return (
      <React.Fragment>
        {meta?.order.map(catId => (
          <ButtonLink key={catId}
            pathname="/manage/[place]/categories/[catId]"
            query={{ place, catId }}
            color="gray.900"
            variant='ghost'
            colorScheme='gray'
            justifyContent="right"
            fontStyle="italic"
            pl={10}
          >{categories[catId].name}</ButtonLink>
        ))}
      </React.Fragment>
    )
  } else {
    return null
  }
}
