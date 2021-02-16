import * as React from 'react'
import useTranslation from 'next-translate/useTranslation'
import Head from 'next/head'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from 'next'

import { Heading } from '@chakra-ui/react'

import admin from '../src/firebase/admin'
import SEO from '../src/components/SEO'

export default function Test(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { t } = useTranslation('test')

    return (
        <div>
            <SEO title="Listing" description="All the order points" />

            <Heading as="h2">{t('list-restaurant')}</Heading>
            <div>
                {props.vendors.map(vendor => <h3 key={vendor.id}>{vendor.name}</h3>)}
            </div>
        </div>
    )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    try {
        const vendorsRef = admin.firestore().collection('vendors')
        const snapshot = await vendorsRef.get()

        if (snapshot.empty) {
            return { props: { vendors: [] } }
        }

        const docs = []
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
