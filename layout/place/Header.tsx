import * as React from "react"
import NextLink from 'next/link'
import NextImage from 'next/image'
import useTranslation from 'next-translate/useTranslation'
import { useAuthUser } from 'next-firebase-auth'

import {
  Box,
  Flex,
  Spacer,
  Stack,
  HStack,
  Link,
  Button,
  IconButton,
  Heading,
  Text,
  Image,
  useBreakpointValue,
  useDisclosure,
  Collapse,
  Badge,
  Icon
} from '@chakra-ui/react'
import { FaLocationArrow, FaSignInAlt, FaUserCog, FaChair, FaWalking, FaBicycle } from 'react-icons/fa'

import { useStoreState, useStoreActions } from '@/store/hooks'

import Container from '@/layout/Container'
import Menu from '@/layout/client/Menu'

import Authentication from '@/forms/Authentication'

import type { Method } from '@/store/session'

import useGeolocation from '@/hooks/useGeolocation'

import MethodMenu from '@/components/MethodMenu'
import { OpeningHours } from "@/types/place"
import { isOpen } from "@/helpers/hours"

const methods = [
  { label: 'now', icon: <FaChair /> },
  { label: 'collect', icon: <FaWalking /> },
  { label: 'delivery', icon: <FaBicycle /> },
]

type PlaceHeaderProps = {
  logo: string
  cover: string
  opening: OpeningHours
}

export default function PlaceHeader({ logo, cover, opening }: PlaceHeaderProps) {
  const { t } = useTranslation('common')
  const login = useDisclosure()
  const method = useStoreState(state => state.basket.method)
  const geoColor = useStoreState(state => state.geolocation.color)
  const isMobile = useBreakpointValue({ base: true, md: false })
  const authUser = useAuthUser()
  const isAuthed = authUser.id !== null

  return (
    <Box w="full" minH="150px"
      bgImage={`url('${cover}')`}
      bgSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
    >
      <Container p={6}>
        <Flex w="100%" align="center">
          <Image boxSize="100px" objectFit="contain" src={logo} alt="Myresto.brussels" />
          <Spacer />
          <HStack spacing={6}>
            {!!method && <MethodMenu />}
            <NextLink href="/user">
              <Button hidden={isMobile || !isAuthed} leftIcon={<FaUserCog />} textColor="gray.900" colorScheme="primary">
                {t('menu-account')}
              </Button>
            </NextLink>
            <Button
              hidden={isMobile || isAuthed}
              leftIcon={<FaSignInAlt />}
              textColor="gray.900"
              colorScheme="primary"
              color="rgb(255,255,255)"
              onClick={login.onToggle}>
              {t('sign-in')}
            </Button>
            <Authentication modal={login} />
            <Menu withCover={true} />
          </HStack>
        </Flex>
      </Container>
      <Box bgColor="gray.100" p="2">
        <HStack>
          <Badge borderRadius="md" px="2" colorScheme={isOpen("now", opening) ? "green" : "red"}>
            <HStack>
              <Icon as={FaChair} />
              <Text>{t('now')}</Text>
            </HStack>
          </Badge>
          <Badge borderRadius="md" px="2" colorScheme={isOpen("takeaway", opening) ? "green" : "red"}>
            <HStack>
              <Icon as={FaWalking} />
              <Text>{t('collect')}</Text>
            </HStack>
          </Badge>
          <Badge borderRadius="md" px="2" colorScheme={isOpen("delivery", opening) ? "green" : "red"}>
            <HStack>
              <Icon as={FaBicycle} />
              <Text>{t('delivery')}</Text>
            </HStack>
          </Badge>
        </HStack>
      </Box>
    </Box>
  )
}
