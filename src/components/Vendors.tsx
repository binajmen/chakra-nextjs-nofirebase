import * as React from "react"

import {
    SimpleGrid,
    Box,
    Badge,
    Image
} from '@chakra-ui/react'
import { MdStar } from "react-icons/md"

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

export type Vendor = {
    name: string
    phone: string
    address: string
}

function VendorCard({ vendor }: VendorCardProps) {
    return (
        <Box boxShadow="lg" borderRadius="lg" overflow="hidden">
            {/* TODO: use Next Image for optimization? */}
            <Image w="100%" src="https://via.placeholder.com/300x200" alt="Image du restaurant" />

            <Box p="6">
                <Box d="flex" alignItems="baseline">
                    <Badge borderRadius="full" px="2" colorScheme="orange">
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
                        {vendor.phone}
                    </Box>
                </Box>

                <Box
                    mt="1"
                    fontWeight="semibold"
                    as="h4"
                    lineHeight="tight"
                    isTruncated
                >
                    {vendor.name}
                </Box>

                <Box>
                    {vendor.address}
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
            </Box>
        </Box>
    )
}