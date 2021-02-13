import Head from 'next/head'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from 'next'

import admin from '../firebase/admin'

export default function Test(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <div>
            <Head>
                <title>Myresto.brussels</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div>
                {props.vendors.map(vendor => <h1>{vendor.name}</h1>)}
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
        snapshot.forEach(doc => docs.push({ id: doc.id, ...doc.data() }))

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