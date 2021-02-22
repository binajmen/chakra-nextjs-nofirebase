import {
    Box,
    Divider,
    Flex,
    Heading,
    HStack,
    IconButton,
    Link,
    SimpleGrid,
    Text,
    VStack
} from '@chakra-ui/react'

import { FaFacebook, FaInstagram } from 'react-icons/fa'

import Container from './Container'

export default function Footer() {
    return (
        <Box as="footer" mt={16}>
            <Container>
                <VStack spacing={4} w="full" align="center" px={6} py={4}>
                    <Flex direction={['column', 'column', 'row']}>
                        <VStack spacing={2} align="flex-start" w={{ base: 'full', lg: 2 / 5 }} mr={8}>
                            <Heading size="lg">Brand</Heading>
                            <Text>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis, nisi! Id.
                        </Text>
                            <HStack spacing={1}>
                                <IconButton aria-label="Facebook" colorScheme="facebook" icon={<FaFacebook size={20} />} />
                                <IconButton aria-label="Instagram" color="white" icon={<FaInstagram size={20} />} style={{ background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)' }} />
                            </HStack>
                        </VStack>
                        <SimpleGrid columns={[2, 3, 3, 4]} w="full" gap={6} justifyContent="space-between">
                            <VStack align="flex-start">
                                <Heading size="sm" textTransform="uppercase">About</Heading>
                                <Link fontSize="sm">Company</Link>
                                <Link fontSize="sm">Community</Link>
                                <Link fontSize="sm">Careers</Link>
                            </VStack>
                            <VStack align="flex-start">
                                <Heading size="sm" textTransform="uppercase">Blog</Heading>
                                <Link fontSize="sm">Tech</Link>
                                <Link fontSize="sm">Music</Link>
                                <Link fontSize="sm">Videos</Link>
                            </VStack>
                            <VStack align="flex-start">
                                <Heading size="sm" textTransform="uppercase">Products</Heading>
                                <Link fontSize="sm">Rosely</Link>
                                <Link fontSize="sm">Ashley</Link>
                                <Link fontSize="sm">Primula</Link>
                            </VStack>
                            <VStack align="flex-start">
                                <Heading size="sm" textTransform="uppercase">Contact</Heading>
                                <Link fontSize="sm">+32 477 19 98 76</Link>
                                <Link fontSize="sm">info@Order.brussels</Link>
                            </VStack>
                        </SimpleGrid>
                    </Flex>
                    <Divider borderColor="gray.500" mx="auto" />
                    <Text fontSize="base">Copyright &copy; {new Date().getFullYear()} Order.brussels</Text>
                </VStack>
            </Container>
        </Box>
    )
}