import * as React from "react"
import NextLink from 'next/link'
import NextImage from 'next/image'

import { SimpleGrid, GridItem, Flex, Box, Badge, Stack, Text, Link, Image } from '@chakra-ui/react'
import { MdStar } from "react-icons/md"

export default function Vendors({ vendors }) {
    return (
        <Box p="5">
            <SimpleGrid columns={[1, 2, 3, 4]} spacing={5}>
                {vendors.map(vendor => <VendorCard vendor={vendor} />)}
            </SimpleGrid>
        </Box>
    )
}

function VendorCard({ vendor }) {
    return (
        <Box borderWidth="1px" borderRadius="lg" borderColor="grey.100" overflow="hidden">
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
                        .map((_, i) => (
                            <MdStar
                                key={i}
                                color={i < 3 ? "orange.500" : "gray.300"}
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