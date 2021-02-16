import * as React from "react"
import NextLink from 'next/link'
import { Flex, Box, Stack, Text, Link } from '@chakra-ui/react'
import { MdClose, MdMenu } from "react-icons/md"

export default function Header({ props = {} }) {
    const [isOpen, setIsOpen] = React.useState(false)

    const toggle = () => setIsOpen(!isOpen)

    return (
        <NavBarContainer {...props}>
            <Logo
                w="100px"
                color={["white", "white", "teal.500", "teal.500"]}
            />
            <MenuToggle toggle={toggle} isOpen={isOpen} />
            <MenuStack toggle={toggle} isOpen={isOpen} />
        </NavBarContainer>
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
            mb={8}
            p={8}
            bg={["teal.500", "teal.500", "transparent", "transparent"]}
            color={["white", "white", "teal.700", "teal.700"]}
            {...props}
        >
            {children}
        </Flex>
    )
}

function Logo(props) {
    return (
        <Box {...props}>
            <Text fontSize="lg" fontWeight="bold">
                Logo
            </Text>
        </Box>
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