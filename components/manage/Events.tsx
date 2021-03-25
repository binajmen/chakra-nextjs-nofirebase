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
import { FaEdit, FaPlus, FaTrash, FaRegEye, FaRegEyeSlash, FaTag, FaQuestion } from 'react-icons/fa'

import { Loading, Error } from '@/components/Suspense'
import Button from '@/components/atoms/Button'
import IconButton from '@/components/atoms/IconButton'

import type { Event } from '@/types/catalog'

export default function Events() {
  const { t } = useTranslation('admin')
  const toast = useToast()
  const router = useRouter()
  const placeId = router.query.placeId

  const events = useCollection<Event>(`places/${placeId}/events`, { listen: true })

  function add() {
    router.push({
      pathname: "/manage/[placeId]/events/new",
      query: { placeId }
    })
  }

  function edit(eventId: string) {
    router.push({
      pathname: "/manage/[placeId]/events/[eventId]",
      query: { placeId, eventId }
    })
  }

  function remove(eventId: string) {
    if (window.confirm()) {
      fuego.db.doc(`places/${placeId}/events/${eventId}`)
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

  if (events.loading) {
    return <Loading />
  } else if (events.error) {
    return <Error error={events.error} />
  } else if (events.data) {
    return (
      <Box>
        <Flex justify="space-between">
          <Heading mb="6">{t('events')}</Heading>
          <Button leftIcon={<FaPlus />} onClick={add}>{t('add')}</Button>
        </Flex>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>{t('name')}</Th>
              <Th>{t('type')}</Th>
              <Th>{t('days')} {"&"} {t('period')}</Th>
              <Th w="1"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {events.data
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((event) => (
                <Tr key={event.id} _hover={{ bgColor: 'primary.50' }}>
                  <Td>{event.name}</Td>
                  <Td>
                    <Stack direction="row" spacing="3">
                      <IconType type={event.type} />
                      <Center>{event.type === "price" ? (
                        <Text>{(event.value as number) / 100}€</Text>
                      ) : (
                        <Text>{t(event.type)}</Text>
                      )}</Center>
                    </Stack>
                  </Td>
                  <Td>
                    <Stack direction="column">
                      <Week days={event.days} />
                      <Text>{event.start} – {event.end}</Text>
                    </Stack></Td>
                  <Td>
                    <Stack direction="row" spacing="2">
                      <Center>
                        <Button
                          aria-label="edit"
                          leftIcon={<FaEdit />}
                          size="sm"
                          onClick={() => edit(event.id)}
                        >
                          {t('edit')}
                        </Button>
                      </Center>
                      <IconButton
                        aria-label="remove"
                        icon={<FaTrash />}
                        size="sm"
                        onClick={() => remove(event.id)}
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
      return <Text as="b" fontSize="1.2rem">{day[0].toUpperCase()}</Text>
    } else {
      return <Text as="span" fontSize="0.9rem">{day[0].toUpperCase()}</Text>
    }
  }

  return (
    <Text letterSpacing="widest">
      {week.map(day => letter(day))}
    </Text>
  )
}

function IconType({ type }: { type: string }) {
  function icon(type: string) {
    switch (type) {
      case "show":
        return FaRegEye
      case "hide":
        return FaRegEyeSlash
      case "price":
        return FaTag
      default:
        return FaQuestion
    }
  }

  return <Icon as={icon(type)} fontSize="1.4rem" />
}