import Head from 'next/head'
import {
    AuthAction,
    useAuthUser,
    withAuthUser
} from 'next-firebase-auth'
import useTranslation from 'next-translate/useTranslation'

import {

} from '@chakra-ui/react'

import Layout from '../../src/layout/Layout'

function VendorIndex() {
    const { t } = useTranslation('common')
    const authUser = useAuthUser()

    return (
        <>
            <Head>
                <title>Sitback.app - Vendor administration</title>
            </Head>
            <Layout>
                Test
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
