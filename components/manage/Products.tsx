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
import { FaEdit, FaPlus, FaTrash, FaRegCalendarCheck, FaTasks } from 'react-icons/fa'

import { Loading, Error } from '@/components/Suspense'
import NextButton from '@/components/atoms/NextButton'
import IconButton from '@/components/atoms/IconButton'

import type { Product } from '@/types/catalog'

export default function Products() {
  const { t } = useTranslation('admin')
  const toast = useToast()
  const router = useRouter()
  const placeId = router.query.placeId

  const products = useCollection<Product>(`places/${placeId}/products`, { listen: true })

  function remove(productId: string) {
    if (window.confirm()) {
      fuego.db.doc(`places/${placeId}/products/${productId}`)
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

  function available(productId: string, current: boolean) {
    fuego.db.doc(`places/${placeId}/products/${productId}`)
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

  if (products.loading) {
    return <Loading />
  } else if (products.error) {
    return <Error error={products.error} />
  } else if (products.data) {
    return (
      <Box>
        <Flex justify="space-between">
          <Heading mb="6">{t('products')}</Heading>
          <NextButton
            aria-label="add"
            leftIcon={<FaPlus />}
            pathname="/manage/[placeId]/products/new"
            query={{ placeId }}
          >
            {t('add')}
          </NextButton>
        </Flex>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th w="1">{t('available')}</Th>
              <Th>{t('name')}</Th>
              <Th>{t('description')}</Th>
              <Th>{t('price')}</Th>
              <Th></Th>
              <Th w="1"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {products.data
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((product) => (
                <Tr key={product.id} _hover={{ bgColor: 'primary.50' }}>
                  <Td textAlign="center">
                    <Switch
                      isChecked={product.available}
                      onChange={() => available(product.id, product.available)} />
                  </Td>
                  <Td>{product.name}</Td>
                  <Td>{product.description}</Td>
                  <Td>{product.price / 100}€</Td>
                  <Td>
                    <Stack direction="row" spacing="2">
                      {product.events?.order?.length && <Icon as={FaRegCalendarCheck} />}
                      {product.modifiers?.order?.length && <Icon as={FaTasks} />}
                    </Stack>
                  </Td>
                  <Td>
                    <Stack direction="row" spacing="2">
                      <Center>
                        <NextButton
                          aria-label="edit"
                          leftIcon={<FaEdit />}
                          size="sm"
                          pathname="/manage/[placeId]/products/[productId]"
                          query={{ placeId, productId: product.id }}
                        >
                          {t('edit')}
                        </NextButton>
                      </Center>
                      <IconButton
                        aria-label="remove"
                        icon={<FaTrash />}
                        size="sm"
                        onClick={() => remove(product.id)}
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
