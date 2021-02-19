import * as React from 'react'

import {
    Flex,
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    CircularProgress,
    Text,
    InputGroup,
    InputRightElement,
    Icon,
    useDisclosure
} from '@chakra-ui/react'

import Login from '../src/forms/Login'

export default function Sand() {
    const modal = useDisclosure()

    return (
        <>
            <Button onClick={modal.onToggle}>Open modal</Button>
            <Login modal={modal} />
        </>
    )
}
