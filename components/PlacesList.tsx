import * as React from "react"
import NextLink from 'next/link'

import {
  SimpleGrid,
  Box,
  Flex,
  Badge,
  Image,
  LinkBox,
  LinkOverlay
} from '@chakra-ui/react'
import { MdStar } from "react-icons/md"

import MethodsAvailable from '@/components/atoms/MethodsAvailable'

import type { Document } from '@/types/common'
import type { Place } from '@/types/place'
import { useStoreState } from "@/store/hooks"

export type PlacesListProps = {
  places: Document<Place>[] | null | undefined
  buttonRender: (id: string) => JSX.Element | null
}

export default function PlacesList({ places, buttonRender }: PlacesListProps) {
  if (!places) return null

  return (
    <Box p="2">
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
  const currentMethod = useStoreState(state => state.order.method)

  const href = `/place/${place.id}${currentMethod ? `/${currentMethod}` : ""}`

  return (
    <LinkBox>
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
              <NextLink
                href={{
                  pathname: `/place/[placeId]${currentMethod ? "/[catalogId]" : ""}`,
                  query: { placeId: place.id, catalogId: currentMethod as string }
                }}
                passHref>
                <LinkOverlay>
                  {place.name}
                </LinkOverlay>
              </NextLink>
            </Box>

            <Box>
              {place.location.address}
            </Box>

            {buttonRender &&
              <Box mt="2" textAlign="right">
                {buttonRender(place.id!)}
              </Box>
            }
          </Box>
        </Flex>
      </Box>
    </LinkBox >
  )
}
