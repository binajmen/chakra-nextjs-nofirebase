import * as React from 'react'
import {
    Flex,
    Box
} from '@chakra-ui/react'

import Layout from '../../src/layout/Layout'
import VendorMenu from '../../src/components/VendorMenu'

type VendorLayoutProps = {
    children: React.ReactNode
}

export default function VendorLayout({ children }: VendorLayoutProps) {
    return (
        <Layout>
            <Flex px={3}>
                <Box px={3} borderRight="1px solid gray">
                    <VendorMenu />
                </Box>
                <Box w="full" px={6}>
                    {children}
                </Box>
            </Flex>
        </Layout>
    )
}
