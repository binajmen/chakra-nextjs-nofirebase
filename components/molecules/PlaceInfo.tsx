import * as React from "react"
import useTranslation from 'next-translate/useTranslation'

import {
  Box,
  Flex,
  HStack,
  Text,
  Badge,
  Icon,
  Heading,
  Collapse,
  Button,
  useDisclosure,
  VStack,
  IconButton
} from '@chakra-ui/react'
import { FaChevronDown, FaChevronUp, FaGlobe, FaBicycle, FaFacebook } from 'react-icons/fa'

import { OpeningHours, Place } from "@/types/place"
import { useStoreState } from "@/store/hooks"

import OpeningHourInline from "@/components/atoms/OpeningHourInline"
import MethodsAvailable from "@/components/atoms/MethodsAvailable"

type PlaceInfoProps = {
  place: Place
}

export default function PlaceInfo({ place }: PlaceInfoProps) {
  const { t } = useTranslation('common')
  const collapse = useDisclosure()

  const method = useStoreState(state => state.basket.method)

  return (
    <Box textAlign="right">
      <Collapse in={collapse.isOpen}>
        <Flex justify="space-between" borderBottom="1px dashed lightgray">
          <Box p="3" w="full" textAlign="left">
            <VStack align="stretch" spacing="2">
              <Heading size="md">{place.name}</Heading>
              <OpeningHourInline method={method} opening={place.opening} />
              <MethodsAvailable methods={place.methods} />
            </VStack>
          </Box>
          <Box p="3">
            <IconButton
              aria-label="website"
              colorScheme="white"
              variant="ghost"
              icon={<FaGlobe />} />
            <IconButton
              aria-label="facebook"
              colorScheme="facebook"
              variant="ghost"
              icon={<FaFacebook />} />
          </Box>
        </Flex>
      </Collapse>

      <Button
        size="sm"
        colorScheme="white"
        variant="ghost"
        rightIcon={collapse.isOpen ? <FaChevronUp /> : <FaChevronDown />}
        onClick={collapse.onToggle}
      >{collapse.isOpen ? "Fermer" : "En savoir plus"}</Button>
    </Box>
  )
}
