import * as React from "react"

import { Box, BoxProps } from '@chakra-ui/react'

export default function Container({ children, ...props }: BoxProps) {
    return (
        <Box {...props} mx="auto" w={{ base: 'full', lg: "62em" }}>
            {children}
        </Box>
    )
}
