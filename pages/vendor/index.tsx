import Head from 'next/head'
import { useRouter } from 'next/router'
import { AuthAction, useAuthUser,  withAuthUser } from 'next-firebase-auth'
import useTranslation from 'next-translate/useTranslation'

import {
    Flex,
    Box
} from '@chakra-ui/react'

import Layout from '../../src/layout/Layout'
import VendorMenu from '../../src/components/VendorMenu'

function VendorIndex() {
    const { t } = useTranslation('common')
    const authUser = useAuthUser()
    const router = useRouter()
    const isActive = router.pathname.includes('schedule')

    return (
        <>
            <Head>
                <title>Myresto.brussels - Vendor administration</title>
            </Head>
            <Layout>
                <Flex px={3}>
                    <Box px={3} borderRight="1px solid gray"><VendorMenu /></Box>
                    <Box w="full" px={3}>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </Box>
                </Flex>
            </Layout>
        </>
    )
}

export default withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(VendorIndex)

// https://github.com/vinissimus/next-translate/issues/487
export function getStaticProps() { return { props: {} }; }
