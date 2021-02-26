import * as React from 'react'
import {
    Flex,
    Box
} from '@chakra-ui/react'

import Layout from '../../src/layout/Layout'
import Menu from '../components/vendor/Menu'

type VendorLayoutProps = {
    children: React.ReactNode
}

export default function VendorLayout({ children }: VendorLayoutProps) {
    return (
        <Layout>
            <Flex px={3}>
                <Box pr={6} borderRight="1px solid gray">
                    <Menu />
                </Box>
                <Box w="full" px={6}>
                    {children}
                </Box>
            </Flex>
        </Layout>
    )
}
