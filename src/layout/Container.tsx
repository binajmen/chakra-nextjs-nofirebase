import * as React from "react"

import {
    Flex,
} from '@chakra-ui/react'

export default function Container({ children }) {
    return (
        <Flex // container
            direction="column"
            align="center"
            maxW={{ xl: "1200px" }}
            m="0 auto"
        >
            {children}
        </Flex>
    )
}
