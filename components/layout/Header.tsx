import * as React from "react"
import useTranslation from 'next-translate/useTranslation'

import {
  Box,
  Flex,
  Spacer,
  HStack,
  Text,
  Image,
  LinkBox,
  LinkOverlay,
  Badge,
  Icon
} from '@chakra-ui/react'
import { FaChair, FaWalking, FaBicycle } from 'react-icons/fa'

import Container from '@/components/layout/Container'

import Navigation from '@/components/layout/Navigation'
import PlaceInfo from '@/components/molecules/PlaceInfo'

import { isOpen } from "@/helpers/hours"

import type { Place } from '@/types/place'
import type { Layout } from './Layout'

type HeaderProps = {
  layout: Layout
  place?: Place | undefined
}

export default function Header(props: HeaderProps) {
  switch (props.layout) {
    case "place":
      return <PlaceHeader {...props} />
    case "checkout":
    case "manage":
    case "admin":
    case "default":
    default:
      return <DefaultHeader {...props} />
  }
}

function PlaceHeader(props: HeaderProps) {
  const { place } = props

  if (place === undefined)
    return <DefaultHeader {...props} />

  else
    return (
      <Box>
        <Box w="full" minH="150px"
          bgImage={`url('${place.cover}')`}
          bgSize="cover"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
        >
          <Container p={6}>
            <Flex justify="space-between">
              <Image boxSize="100px" objectFit="contain" src={place.logo} alt={place.name} />
              <Navigation withCover={true} />
            </Flex>
          </Container>
        </Box>

        <PlaceInfo place={place} />
      </Box>
    )
}

function DefaultHeader({ layout }: HeaderProps) {
  return (
    <Container p={6}>
      <Flex justify="space-between">
        <LinkBox>
          <LinkOverlay href="/">
            <Image boxSize="100px" objectFit="contain" src="/logo.svg" alt="Myresto.brussels" />
          </LinkOverlay>
        </LinkBox>
        <Navigation withMethod={layout !== "checkout"} />
      </Flex>
    </Container >
  )
}
