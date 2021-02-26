import Head from 'next/head'
import { useRouter } from 'next/router'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from 'next'
import { AuthAction, useAuthUser, withAuthUser, withAuthUserSSR } from 'next-firebase-auth'
import useTranslation from 'next-translate/useTranslation'

import {
    Flex,
    Box,
    Heading
} from '@chakra-ui/react'

import admin from '../../src/firebase/admin'

import Layout from '../../src/layout/Layout'
import Cards from '../../src/components/vendor/Cards'

function VendorIndex(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { t } = useTranslation('common')
    const { vendors } = props

    return (
        <>
            <Layout>
                <Heading mb={3} size="md">Sélectionnez le restaurant que vous souhaitez administrer :</Heading>
                <Cards vendors={vendors} />
            </Layout>
        </>
    )
}

export default withAuthUser<InferGetServerSidePropsType<typeof getServerSideProps>>({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(VendorIndex)

export const getServerSideProps = withAuthUserSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser }) => {
    try {
        const doc = await admin.firestore()
            .collection('roles')
            .doc(AuthUser.id!)
            .get()

        if (!doc.exists) return { notFound: true }

        const { vendors } = doc.data() ?? []
        console.log('vendors:', vendors)

        const snapshot = await admin.firestore()
            .collection('vendors')
            .where(admin.firestore.FieldPath.documentId(), "in", vendors)
            .get()

        // TODO: Fix type
        let data: any = []
        snapshot.forEach(doc => {
            data.push({ ...doc.data(), id: doc.id })
        })

        console.log('data:', data)

        return { props: { vendors: data } }
    } catch (error) {
        console.error(error)
        return { notFound: true }
    }
})
