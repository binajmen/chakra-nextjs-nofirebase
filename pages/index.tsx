import * as React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { withAuthUser } from 'next-firebase-auth'

import useTranslation from 'next-translate/useTranslation'

import type { InferGetServerSidePropsType, GetServerSidePropsContext } from 'next'

import admin from '../src/firebase/admin'

import Layout from '../src/layout/Layout'
import SearchInput from '../src/components/SearchInput'
import Vendors from '../src/components/Vendors'

function Index(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
                <Vendors vendors={props.vendors} />
            </Layout>
        </>
    )
}

export default withAuthUser<InferGetServerSidePropsType<typeof getServerSideProps>>()(Index)

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    try {
        const vendorsRef = admin.firestore().collection('vendors')
        const snapshot = await vendorsRef.get()

        if (snapshot.empty) {
            return { props: { vendors: [] } }
        }

        const docs: any = [] // TOFIX: define type
        snapshot.forEach(doc => {
            const { geopoint, ...rest } = doc.data()
            docs.push({ id: doc.id, ...rest })
        })

        return {
            props: {
                vendors: docs
            }
        }

        // return {
        //     props: {
        //         vendors: [
        //             { id: "test", name: "Test", address: "test", phone: "test" },
        //             { id: "test", name: "Test", address: "test", phone: "test" },
        //             { id: "test", name: "Test", address: "test", phone: "test" },
        //         ]
        //     }
        // }
    } catch (error) {
        console.error(error)
        return { redirect: { destination: '/404', permanent: false } }
    }
}
