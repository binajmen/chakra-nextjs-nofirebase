import * as React from "react"
import useTranslation from "next-translate/useTranslation"

import {
    SimpleGrid,
    Box,
    Image,
    Text
} from '@chakra-ui/react'

import ButtonLink from '../ButtonLink'

export type Vendor = {
    id: string
    name: string
    phone: string
    address: string
    cover: string
}

export type VendorsProps = {
    vendors: Vendor[]
}

export default function Vendors({ vendors }: VendorsProps) {
    return (
        <Box p={3}>
            <SimpleGrid columns={[1, 2, 3, 4]} spacing={5}>
                {vendors.map((vendor, index) => <VendorCard key={index} vendor={vendor} />)}
            </SimpleGrid>
        </Box>
    )
}

export type VendorCardProps = {
    vendor: Vendor
}

function VendorCard({ vendor }: VendorCardProps) {
    const { t } = useTranslation()

    return (
        <Box boxShadow="lg" borderRadius="lg" overflow="hidden">
            {/* TODO: use Next Image for optimization? */}
            <Image w="100%" src={vendor.cover} alt="Image du restaurant" />

            <Box p="3">
                <Text as="b">{vendor.name}</Text>
                <Text>{vendor.address}</Text>
            </Box>

            <Box p="3" textAlign="right">
                <ButtonLink
                    size="sm"
                    color="gray.900"
                    colorScheme="primary"
                    pathname="/vendor/[vendorId]"
                    query={{ id: vendor.id }}
                >{t('vendor:manage')}</ButtonLink>
            </Box>
        </Box>
    )
}
