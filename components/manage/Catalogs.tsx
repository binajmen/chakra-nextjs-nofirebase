import * as React from 'react'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { useCollection } from '@nandorojo/swr-firestore'

import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react'
import { FaEdit } from 'react-icons/fa'

import NextButton from '@/components/atoms/NextButton'
import { Loading, Error } from '@/components/Suspense'

import type { Catalog } from '@/types/catalog'

export default function Catalogs() {
  const { t } = useTranslation('admin')
  const router = useRouter()
  const placeId = router.query.placeId

  const catalogs = useCollection<Catalog>(`places/${placeId}/catalogs`)

  if (catalogs.loading) {
    return <Loading />
  } else if (catalogs.error) {
    return <Error error={catalogs.error} />
  } else if (catalogs.data) {
    return (
      <Box>
        <Heading mb="6">{t('catalogs')}</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>{t('catalog')}</Th>
              <Th>{t('name')}</Th>
              <Th>{t('description')}</Th>
              <Th w="1">{t('categories')}</Th>
              <Th w="1"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {catalogs.data.map((catalog) => (
              <Tr key={catalog.name} _hover={{ bgColor: 'primary.50' }}>
                <Td>{t(`common:${catalog.id}`)}</Td>
                <Td>{catalog.name}</Td>
                <Td>{catalog.description}</Td>
                <Td>{catalog.categories.length}</Td>
                <Td>
                  <NextButton
                    aria-label="edit"
                    leftIcon={<FaEdit />}
                    size="sm"
                    pathname="/manage/[placeId]/catalogs/[catalogId]"
                    query={{ placeId, catalogId: catalog.id }}
                  >
                    {t('edit')}
                  </NextButton>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    )
  }

  return null
}
