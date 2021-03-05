import * as React from "react"

import {
  SimpleGrid,
  Box,
  Badge,
  Image
} from '@chakra-ui/react'
import { MdStar } from "react-icons/md"

import type { Place } from '@/types/place'

export type PlacesListProps = {
  places: Place[]
  buttonRender: (id: string) => JSX.Element | null
}

export default function PlacesList({ places, buttonRender }: PlacesListProps) {
  return (
    <Box>
      <SimpleGrid columns={[1, 2, 3, 4]} spacing={6}>
        {places.map(place => <PlaceCard key={place.id} place={place} buttonRender={buttonRender} />)}
      </SimpleGrid>
    </Box>
  )
}

export type PlaceCardProps = {
  place: Place
  buttonRender: (id: string) => JSX.Element | null
}

function PlaceCard({ place, buttonRender }: PlaceCardProps) {
  return (
    <Box boxShadow="lg" borderRadius="lg" overflow="hidden">
      {/* TODO: use Next Image for optimization? */}
      <Image w="100%" src={place.cover} alt="Image du restaurant" />

      <Box p="3">
        <Box d="flex" alignItems="baseline">
          <Badge borderRadius="full" px="2" colorScheme="primary">
            New
          </Badge>
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            ml="2"
          >
            {place.phone}
          </Box>
        </Box>

        <Box
          mt="1"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          isTruncated
        >
          {place.name}
        </Box>

        <Box>
          {place.address}
        </Box>

        <Box d="flex" mt="2" alignItems="center">
          {Array(5)
            .fill("")
            .map((_, index) => (
              <MdStar
                key={index}
                color={index < 3 ? "orange.500" : "gray.300"}
              />
            ))}
          <Box as="span" ml="2" color="gray.600" fontSize="sm">
            2 reviews
          </Box>
        </Box>

        {buttonRender &&
          <Box mt="2" textAlign="right">
            {buttonRender(place.id!)}
          </Box>
        }
      </Box>
    </Box>
  )
}