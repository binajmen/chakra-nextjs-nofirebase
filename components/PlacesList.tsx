import * as React from "react"

import {
  SimpleGrid,
  Box,
  Flex,
  Badge,
  Image
} from '@chakra-ui/react'
import { MdStar } from "react-icons/md"

import MethodsAvailable from '@/components/atoms/MethodsAvailable'

import type { Document } from '@/types/common'
import type { Place } from '@/types/place'

export type PlacesListProps = {
  places: Document<Place>[] | null | undefined
  buttonRender: (id: string) => JSX.Element | null
}

export default function PlacesList({ places, buttonRender }: PlacesListProps) {
  if (!places) return null

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
    <Box>
      <Box boxShadow="lg" borderRadius="lg" overflow="hidden">
        {/* TODO: use Next Image for optimization? */}
        <Image objectFit="cover" maxH="150px" w="full" src={place.cover} alt="Image du restaurant" />

        <Flex direction="column" justify="space-between">
          <Box p="3">
            <MethodsAvailable methods={place.methods} filter={true} />

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
        </Flex>
      </Box>
    </Box>
  )
}