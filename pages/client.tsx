import * as React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { withAuthUser } from 'next-firebase-auth'

import useTranslation from 'next-translate/useTranslation'

import type { InferGetServerSidePropsType, GetServerSidePropsContext } from 'next'

import firebase from '../src/firebase/client'

import Layout from '../src/layout/Layout'
import SearchInput from '../src/components/SearchInput'
import Vendors from '../src/components/Vendors'

function Index() {
    const { t } = useTranslation('test')
    const router = useRouter()
    const [vendors, setVendors] = React.useState([])
    const { locale, locales, defaultLocale } = router

    React.useEffect(() => {
        const vendorsRef = firebase.firestore().collection('vendors')
        vendorsRef.get()
            .then(snapshot => {
                if (!snapshot.empty) {
                    const docs: any = [] // TOFIX: define type
                    snapshot.forEach(doc => {
                        const { geopoint, ...rest } = doc.data()
                        docs.push({ id: doc.id, ...rest })
                    })
                    setVendors(docs)
                }
            })
            .catch(error => console.log(error))
    }, [])

    return (
        <>
            <Head>
                <title>Order.brussels</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout>
                <SearchInput />
                <Vendors vendors={vendors} />
            </Layout>
        </>
    )
}

export default withAuthUser()(Index)
