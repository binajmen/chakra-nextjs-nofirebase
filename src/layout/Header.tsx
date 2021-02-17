import * as React from "react"
import NextLink from 'next/link'
import NextImage from 'next/image'
import useTranslation from 'next-translate/useTranslation'

import {
    Box,
    Flex,
    Spacer,
    Stack,
    HStack,
    Link,
    Button,
    Heading,
    Text,
    Image,
    useBreakpointValue
} from '@chakra-ui/react'
import { MdClose, MdMenu } from "react-icons/md"
import { FaLock, FaChair, FaWalking, FaBicycle } from 'react-icons/fa'

import Container from './Container'
import Menu from './Menu'

const methods = [
    { label: 'on-the-spot', icon: <FaChair /> },
    { label: 'take-away', icon: <FaWalking /> },
    { label: 'delivery', icon: <FaBicycle /> },
]

export default function Header() {
    const { t } = useTranslation('common')
    const shouldHide = useBreakpointValue({ base: true, md: false })
    const [isOpen, setIsOpen] = React.useState(false)

    const toggle = () => setIsOpen(!isOpen)

    return (
        <Box bgGradient="linear(to-b, secondary.200, white)">
            <Container>

                <Flex p={5} w="100%" align="center">
                    <Image boxSize="100px" objectFit="contain" src="/logo_transparent.png" alt="Myresto.brussels" />
                    <Spacer />
                    <HStack spacing={5}>
                        <Button hidden={shouldHide} leftIcon={<FaLock />} colorScheme="secondary">
                            {t('menu-connect')}
                        </Button>
                        <Menu />
                    </HStack>
                </Flex>

                <Heading pb={5} size="lg">Je veux commander...</Heading>

                <Stack direction={['column', 'row']} spacing={5}>
                    {methods.map((method, index) =>
                        <Button key={index}
                            colorScheme="secondary"
                            fontSize="xl"
                            leftIcon={method.icon}
                        >{t(method.label)}</Button>
                    )}
                </Stack>

            </Container>

        </Box >
    )
}

function NavBarContainer({ children, ...props }) {
    return (
        <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            w="100%"
            p={8}
            // bg={["gray.100", "gray.100", "transparent", "transparent"]}
            color={["white", "white", "teal.700", "teal.700"]}
            {...props}
        >
            {children}
        </Flex>
    )
}

function MenuToggle({ toggle, isOpen }) {
    return (
        <Box display={{ base: "block", md: "none" }} onClick={toggle}>
            {isOpen ? <MdClose /> : <MdMenu />}
        </Box>
    )
}

function MenuStack({ toggle, isOpen }) {
    return (
        <Box
            display={{ base: isOpen ? "block" : "none", md: "block" }}
            flexBasis={{ base: "100%", md: "auto" }}
        >
            <Stack
                spacing={8}
                align="center"
                justify={["center", "space-between", "flex-end", "flex-end"]}
                direction={["column", "row", "row", "row"]}
                pt={[4, 4, 0, 0]}
            >
                <MenuItem to="/">Home</MenuItem>
                <MenuItem to="/" isLast>How It Works</MenuItem>
            </Stack>
        </Box>
    )
}

function MenuItem({ children, isLast = false, to = "/", ...rest }) {
    return (
        <NextLink href={to} passHref>
            <Link>
                <Text display="block" {...rest}>
                    {children}
                </Text>
            </Link>
        </NextLink>
    )
}