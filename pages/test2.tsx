import * as React from 'react'
import Head from 'next/head'

import firebase from '../src/firebase/client'

export default function Test2() {
    const [vendors, setVendors] = React.useState([])

    React.useEffect(() => {
        const vendorsRef = firebase.firestore().collection('vendors')
        vendorsRef.get().then(snapshot => {
            if (!snapshot.empty) {
                const docs = []
                snapshot.forEach(doc => docs.push({ id: doc.id, ...doc.data() }))
                console.log(docs)
                setVendors(docs)
            }
        })
    }, [])

    return (
        <div>
            <Head>
                <title>Myresto.brussels</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* <h1>{t('list-restaurant')}</h1> */}
            <div>
                {vendors.map(vendor => <h3 key={vendor.id}>{vendor.name}</h3>)}
            </div>
        </div>
    )
}
