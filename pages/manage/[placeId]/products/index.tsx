import * as React from 'react'
import { AuthAction, withAuthUser, withAuthUserSSR } from 'next-firebase-auth'

import admin from '@/lib/firebase/admin'

import Layout from '@/components/layout/Layout'
import Products from '@/components/manage/Products'

function CatalogsIndex() {
  return (
    <Layout
      layout="manager"
      subHeader="hide"
      metadata={{ title: "Methods" }}
    >
      <Products />
    </Layout>
  )
}

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(CatalogsIndex)

export const getServerSideProps = withAuthUserSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ query, AuthUser }) => {
  try {
    // retrieve place id
    const { placeId } = query

    // retrieve roles for the current user
    const doc = await admin.firestore()
      .collection('roles')
      .doc(AuthUser.id!)
      .get()

    // if no roles or no roles for the requested place, 404
    if (!doc.exists || !doc.data()!.places?.includes(placeId)) return { notFound: true }

    // else
    return { props: {} }
  } catch (error) {
    console.error(error)
    return { notFound: true }
  }
})
