import * as React from 'react'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { fuego, useCollection } from '@nandorojo/swr-firestore'

import {
  Box,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Switch,
  Stack,
  Center,
  Icon,
  useToast
} from '@chakra-ui/react'
import { FaEdit, FaPlus, FaTrash, FaBoxes, FaRegCalendarCheck, FaTasks } from 'react-icons/fa'

import { Loading, Error } from '@/components/Suspense'
import Button from '@/components/atoms/Button'
import IconButton from '@/components/atoms/IconButton'

import type { Category } from '@/types/catalog'

export default function Categories() {
  const { t } = useTranslation('admin')
  const toast = useToast()
  const router = useRouter()
  const placeId = router.query.placeId

  const categories = useCollection<Category>(`places/${placeId}/categories`, { listen: true })

  function add() {
    router.push({
      pathname: "/manage/[placeId]/categories/new",
      query: { placeId }
    })
  }

  function edit(categoryId: string) {
    router.push({
      pathname: "/manage/[placeId]/categories/[categoryId]",
      query: { placeId, categoryId }
    })
  }

  function remove(categoryId: string) {
    if (window.confirm()) {
      fuego.db.doc(`places/${placeId}/categories/${categoryId}`)
        .delete()
        .then(() => toast({
          description: t('changes-saved'),
          status: "success"
        }))
        .catch((error: any) => toast({
          description: error.message,
          status: "error"
        }))
    }
  }

  function available(categoryId: string, current: boolean) {
    fuego.db.doc(`places/${placeId}/categories/${categoryId}`)
      .update({ available: !current })
      .then(() => toast({
        description: t('changes-saved'),
        status: "success"
      }))
      .catch((error: any) => toast({
        description: error.message,
        status: "error"
      }))
  }

  if (categories.loading) {
    return <Loading />
  } else if (categories.error) {
    return <Error error={categories.error} />
  } else if (categories.data) {
    return (
      <Box>
        <Flex justify="space-between">
          <Heading mb="6">{t('categories')}</Heading>
          <Button leftIcon={<FaPlus />} onClick={add}>{t('add')}</Button>
        </Flex>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th w="1">{t('available')}</Th>
              <Th>{t('name')}</Th>
              <Th>{t('description')}</Th>
              <Th></Th>
              <Th w="1"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {categories.data.map((category) => (
              <Tr key={category.id} _hover={{ bgColor: 'primary.50' }}>
                <Td textAlign="center">
                  <Switch
                    isChecked={category.available}
                    onChange={() => available(category.id, category.available)} />
                </Td>
                <Td>{category.name}</Td>
                <Td>{category.description}</Td>
                <Td>
                  <Stack direction="row" spacing="2">
                    {category.products.length && <Icon as={FaBoxes} />}
                    {category.events?.order?.length && <Icon as={FaRegCalendarCheck} />}
                    {category.modifiers?.order?.length && <Icon as={FaTasks} />}
                  </Stack>
                </Td>
                <Td>
                  <Stack direction="row" spacing="2">
                    <Center>
                      <Button
                        aria-label="edit"
                        leftIcon={<FaEdit />}
                        size="sm"
                        onClick={() => edit(category.id)}
                      >
                        {t('edit')}
                      </Button>
                    </Center>
                    <IconButton
                      aria-label="remove"
                      icon={<FaTrash />}
                      size="sm"
                      onClick={() => remove(category.id)}
                      colorScheme="red"
                      color="tomato"
                      variant="ghost" />
                  </Stack>
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
