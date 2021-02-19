import * as React from 'react'
import useTranslation from 'next-translate/useTranslation'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from 'next'

import {
    Heading,
    Button,
    Text, HStack
} from '@chakra-ui/react'

import admin from '../src/firebase/admin'
import Head from '../src/components/Head'

import { useStoreState, useStoreActions } from '../src/store/hooks'

export default function Test(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { t } = useTranslation('test')
    const method = useStoreState(state => state.session.method)
    const setMethod = useStoreActions(actions => actions.session.setMethod)

    return (
        <div>
            <Head title="Listing" description="All the order points" />

            <Heading as="h2">{t('list-restaurant')}</Heading>

            <HStack>
                <Text>{method}</Text>
                <Button onClick={() => setMethod('onspot')}>onspot</Button>
                <Button onClick={() => setMethod('takeaway')}>takeaway</Button>
                <Button onClick={() => setMethod('delivery')}>delivery</Button>
            </HStack>
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
