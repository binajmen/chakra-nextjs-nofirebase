import * as React from "react"
import useTranslation from 'next-translate/useTranslation'

import {
  Box,
  Flex,
  Spacer,
  HStack,
  Text,
  Image,
  Badge,
  Icon
} from '@chakra-ui/react'
import { FaChair, FaWalking, FaBicycle } from 'react-icons/fa'

import Container from '@/layout/Container'

import HeaderNav from '@/components/molecules/HeaderNav'
import PlaceInfo from '@/components/molecules/PlaceInfo'

import { OpeningHours, Place } from "@/types/place"
import { isOpen } from "@/helpers/hours"

type PlaceHeaderProps = {
  place: Place
}

export default function PlaceHeader({ place }: PlaceHeaderProps) {
  const { t } = useTranslation('common')

  return (
    <Box>
      <Box w="full" minH="150px"
        bgImage={`url('${place.cover}')`}
        bgSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
      >
        <Container p={6}>
          <Flex w="100%" align="center">
            <Image boxSize="100px" objectFit="contain" src={place.logo} alt="Myresto.brussels" />
            <Spacer />
            <HeaderNav withCover={true} />
          </Flex>
        </Container>
      </Box>

      <PlaceInfo place={place} />
    </Box>
  )
}
