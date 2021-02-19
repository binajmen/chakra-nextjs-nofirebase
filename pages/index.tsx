import * as React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import useTranslation from 'next-translate/useTranslation'

import type { InferGetServerSidePropsType, GetServerSidePropsContext } from 'next'

import admin from '../src/firebase/admin'

import Layout from '../src/layout/Layout'
import SearchInput from '../src/components/SearchInput'
import Vendors from '../src/components/Vendors'

export default function Index(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { t } = useTranslation('test')
    const router = useRouter()

    const { locale, locales, defaultLocale } = router

    return (
        <>
            <Head>
                <title>Myresto.brussels</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout>
                <SearchInput />
                <Vendors vendors={props.vendors} />
            </Layout>
        </>
    )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    try {
        const vendorsRef = admin.firestore().collection('vendors')
        const snapshot = await vendorsRef.get()

        if (snapshot.empty) {
            return { props: { vendors: [] } }
        }

        // TOFIX: define correct type
        const docs: any = []
        snapshot.forEach(doc => {
            const { geopoint, ...rest } = doc.data()
            docs.push({ id: doc.id, ...rest })
        })

        return {
            props: { vendors: docs }
        }
    } catch (err) {
        // either the `token` cookie didn't exist
        // or token verification failed
        // either way: redirect to the login page
        ctx.res.writeHead(302, { Location: '/login' })
        ctx.res.end()

        // `as never` prevents inference issues
        // with InferGetServerSidePropsType.
        // The props returned here don't matter because we've
        // already redirected the user.
        return { props: {} as never }
    }
}
