import * as React from 'react'
import { AuthAction, withAuthUser, withAuthUserSSR, withAuthUserTokenSSR } from 'next-firebase-auth'

import admin from '@/lib/firebase/admin'

import Layout from '@/components/layout/Layout'
import Modifiers from '@/components/manage/Modifiers'
import { toReadableClaims } from '@/hooks/useAuthClaims'

function ModifiersIndex() {
  return (
    <Layout
      layout="manager"
      subHeader="hide"
      metadata={{ title: "Options" }}
    >
      <Modifiers />
    </Layout>
  )
}

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(ModifiersIndex)

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ query, AuthUser }) => {
  try {
    const token = await AuthUser.getIdToken()
    const decodedToken = await admin.auth().verifyIdToken(token ?? '')
    const claims = toReadableClaims(decodedToken)

    if (claims.manager && claims.managerOf.includes(query.placeId as string)) {
      return { props: {} }
    } else {
      return { notFound: true }
    }
  } catch (error) {
    console.error(error)
    return { notFound: true }
  }
})
