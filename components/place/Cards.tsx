import * as React from "react"
import useTranslation from "next-translate/useTranslation"

import {
    SimpleGrid,
    Box,
    Image,
    Text
} from '@chakra-ui/react'

import ButtonLink from '@/components/atoms/NextButton'

export type Place = {
    id: string
    name: string
    phone: string
    address: string
    cover: string
}

export type PlacesProps = {
    places: Place[]
}

export default function Places({ places }: PlacesProps) {
    return (
        <Box p={3}>
            <SimpleGrid columns={[1, 2, 3, 4]} spacing={5}>
                {places.map((place, index) => <PlaceCard key={index} place={place} />)}
            </SimpleGrid>
        </Box>
    )
}

export type PlaceCardProps = {
  place: Place
}

function PlaceCard({ place }: PlaceCardProps) {
    const { t } = useTranslation()

    return (
        <Box boxShadow="lg" borderRadius="lg" overflow="hidden">
            {/* TODO: use Next Image for optimization? */}
            <Image w="100%" src={place.cover} alt="Image du restaurant" />

            <Box p="3">
                <Text as="b">{place.name}</Text>
                <Text>{place.address}</Text>
            </Box>

            <Box p="3" textAlign="right">
                <ButtonLink
                    size="sm"
                    color="gray.900"
                    colorScheme="primary"
                    pathname="/place/[placeId]"
                    query={{ placeId: place.id }}
                >{t('admin:manage')}</ButtonLink>
            </Box>
        </Box>
    )
}
