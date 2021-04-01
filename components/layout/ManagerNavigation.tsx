import * as React from 'react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

import { Divider, VStack } from '@chakra-ui/react'
import { FaBuilding, FaCog, FaClock, FaBookOpen, FaFolderOpen, FaBoxes, FaRegCalendarCheck, FaTasks, FaArrowLeft } from 'react-icons/fa'

import ButtonLink from '@/components/atoms/NextButton'

const items = [
  { label: "general", pathname: "/manage/[placeId]/", icon: <FaBuilding /> },
  { label: "settings", pathname: "/manage/[placeId]/settings", icon: <FaCog /> },
  { label: "opening", pathname: "/manage/[placeId]/opening", icon: <FaClock /> },
  { label: "catalogs", pathname: "/manage/[placeId]/catalogs", icon: <FaBookOpen /> },
  { label: "categories", pathname: "/manage/[placeId]/categories", icon: <FaFolderOpen /> },
  { label: "products", pathname: "/manage/[placeId]/products", icon: <FaBoxes /> },
  { label: "events", pathname: "/manage/[placeId]/events", icon: <FaRegCalendarCheck /> },
  { label: "modifiers", pathname: "/manage/[placeId]/modifiers", icon: <FaTasks /> },
]

export default function Menu() {
  const { t } = useTranslation('admin')
  const router = useRouter()
  const pathname = router.pathname
  const placeId = router.query.placeId

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
              query={{ placeId }}
              leftIcon={item.icon}
              color="gray.900"
              variant={isActive ? 'solid' : 'ghost'}
              colorScheme={isActive ? 'primary' : 'gray'}
              justifyContent="left"
            >{t(item.label)}</ButtonLink>
            {/* {isActive && item.label === 'categories' && <CategoriesMenu />} */}
          </React.Fragment>
        )
      })}
      <Divider />
      <ButtonLink
        pathname="/manage"
        leftIcon={<FaArrowLeft />}
        variant='ghost'
        colorScheme='gray'
        justifyContent="left"
      >{t('back')}</ButtonLink>
    </VStack>
  )
}

// function CategoriesMenu() {
//   const router = useRouter()
//   const place = router.query.place

//   const { data: catArr } = useCollection<Category>(`places/${place}/categories`, { listen: true })
//   const { data: meta } = useDocument<CategoryMeta>(`places/${place}/categories/_meta_`)
//   const categories: Categories = catArr?.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {}) ?? {}

//   if (meta?.order.length && catArr?.length) {
//     return (
//       <React.Fragment>
//         {meta?.order.map(catId => (
//           <ButtonLink key={catId}
//             pathname="/manage/[placeId]/categories/[catId]"
//             query={{ place, catId }}
//             color="gray.900"
//             variant='ghost'
//             colorScheme='gray'
//             justifyContent="right"
//             fontStyle="italic"
//             pl={10}
//           >{categories[catId].name}</ButtonLink>
//         ))}
//       </React.Fragment>
//     )
//   } else {
//     return null
//   }
// }
