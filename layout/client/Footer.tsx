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
  VStack,
  Image,
  useBreakpointValue
} from '@chakra-ui/react'

import { FaFacebook, FaInstagram } from 'react-icons/fa'

import Container from '@/layout/Container'

export default function Footer() {
  const isMobile = useBreakpointValue({ base: true, md: false })

  return (
    <Box as="footer" mt={16} bg="primary.50">
      <Container p={6}>
        <Flex w="full" direction={['column', 'column', 'row']}>
          <VStack align="flex-start"
            w={{ base: 'full', lg: 2 / 5 }}
            mb={{ base: '6', md: '0' }}
            mr={{ base: '0', md: '6' }}
          >
            <Image boxSize="75px" objectFit="contain" src="/logo.svg" alt="Myresto.brussels" />
            <Text fontSize="sm">
              Plateforme de commandes reposant sur un modèle équitable pous tous.
                        </Text>
            <HStack spacing={3}>
              <IconButton size="sm" aria-label="Facebook" colorScheme="facebook" icon={<FaFacebook size={20} />} />
              <IconButton size="sm" aria-label="Instagram" color="white" icon={<FaInstagram size={20} />} style={{ background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)' }} />
            </HStack>
          </VStack>
          <Divider hidden={!isMobile} borderColor="primary.700" mx="auto" mb={3} />
          <SimpleGrid columns={[2, 2, 2, 4]} w="full" gap={6} justifyContent="space-between">
            <VStack align="flex-start">
              <Heading size="sm" textTransform="uppercase" color="primary.700">À propos</Heading>
              <Link fontSize="sm">Histoire</Link>
              <Link fontSize="sm">Partenaires</Link>
              <Link fontSize="sm">Jobs</Link>
            </VStack>
            <VStack align="flex-start">
              <Heading size="sm" textTransform="uppercase" color="primary.700">Plateforme</Heading>
              <Link fontSize="sm">Client</Link>
              <Link fontSize="sm">Commerce</Link>
              <Link fontSize="sm">Livreur</Link>
            </VStack>
            <VStack align="flex-start">
              <Heading size="sm" textTransform="uppercase" color="primary.700">Contact</Heading>
              <Link fontSize="sm">+32 477 19 98 76</Link>
              <Link fontSize="sm">info@mail.be</Link>
            </VStack>
            <VStack align="flex-start">
              <Heading size="sm" textTransform="uppercase" color="primary.700">Legal</Heading>
              <Link fontSize="sm">Terms</Link>
              <Link fontSize="sm">Privacy</Link>
            </VStack>
          </SimpleGrid>
        </Flex>
      </Container>
      <Box as="footer" py={6} bg="primary.100">
        <Text fontSize="sm" color="gray.700" textAlign="center">Copyright &copy; {new Date().getFullYear()} Myresto.brussels</Text>
      </Box>
    </Box >
  )
}