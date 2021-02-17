import * as React from "react"

import { Box } from '@chakra-ui/react'

export default function Container({ children, ...props }) {
    return (
        <Box {...props} mx="auto" w={{ base: 'full', lg: "62em" }}>
            {children}
        </Box>
    )
}
