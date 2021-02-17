import * as React from "react"

import { Box, InputGroup, Input, InputLeftElement } from '@chakra-ui/react'
import { MdSearch } from "react-icons/md"

export default function SearchInput() {
    return (
        <Box p={5}>
            <InputGroup>
                <InputLeftElement
                    pointerEvents="none"
                    children={<MdSearch color="gray.300" />}
                />
                <Input type="tel" placeholder="Phone number" bg="white" />
            </InputGroup>
        </Box>
    )
}