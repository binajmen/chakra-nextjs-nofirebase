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
  Stack,
  Center,
  Text,
  Icon,
  useToast
} from '@chakra-ui/react'
import { FaEdit, FaPlus, FaTrash, FaEye, FaEyeSlash, FaTag, FaQuestion } from 'react-icons/fa'

import { Loading, Error } from '@/components/Suspense'
import Button from '@/components/atoms/Button'
import IconButton from '@/components/atoms/IconButton'

import type { Modifier } from '@/types/catalog'

export default function Modifiers() {
  const { t } = useTranslation('admin')
  const toast = useToast()
  const router = useRouter()
  const placeId = router.query.placeId

  const modifiers = useCollection<Modifier>(`places/${placeId}/modifiers`, { listen: true })

  function add() {
    router.push({
      pathname: "/manage/[placeId]/modifiers/new",
      query: { placeId }
    })
  }

  function edit(modifierId: string) {
    router.push({
      pathname: "/manage/[placeId]/modifiers/[modifierId]",
      query: { placeId, modifierId }
    })
  }

  function remove(modifierId: string) {
    if (window.confirm()) {
      fuego.db.doc(`places/${placeId}/modifiers/${modifierId}`)
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

  if (modifiers.loading) {
    return <Loading />
  } else if (modifiers.error) {
    return <Error error={modifiers.error} />
  } else if (modifiers.data) {
    return (
      <Box>
        <Flex justify="space-between">
          <Heading mb="6">{t('modifiers')}</Heading>
          <Button leftIcon={<FaPlus />} onClick={add}>{t('add')}</Button>
        </Flex>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>{t('name')}</Th>
              <Th>{t('description')}</Th>
              <Th>{t('min')} – {t('max')}</Th>
              <Th>{t('options')}</Th>
              <Th w="1"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {modifiers.data.map((modifier) => (
              <Tr key={modifier.id} _hover={{ bgColor: 'primary.50' }}>
                <Td>{modifier.name}</Td>
                <Td>{modifier.description}</Td>
                <Td>{modifier.min} – {modifier.max}</Td>
                <Td>{modifier.products.order?.length ?? 0}</Td>
                <Td>
                  <Stack direction="row" spacing="2">
                    <Center>
                      <Button
                        aria-label="edit"
                        leftIcon={<FaEdit />}
                        size="sm"
                        onClick={() => edit(modifier.id)}
                      >
                        {t('edit')}
                      </Button>
                    </Center>
                    <IconButton
                      aria-label="remove"
                      icon={<FaTrash />}
                      size="sm"
                      onClick={() => remove(modifier.id)}
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

function Week({ days }: { days: string[] }) {
  const week = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]

  function letter(day: string) {
    if (days.includes(day)) {
      return <strong>{day[0].toUpperCase()}</strong>
    } else {
      return <span>{day[0].toUpperCase()}</span>
    }
  }

  return (
    <Text letterSpacing="widest">
      {week.map(day => letter(day))}
    </Text>
  )
}

function Type({ type }: { type: string }) {
  function icon(type: string) {
    switch (type) {
      case "show":
        return FaEye
      case "hide":
        return FaEyeSlash
      case "price":
        return FaTag
      default:
        return FaQuestion
    }
  }

  return <Icon as={icon(type)} fontSize="1.4rem" />
}