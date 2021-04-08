import * as React from 'react'
import { useRouter } from 'next/router'
import { AuthAction, withAuthUser, withAuthUserSSR, withAuthUserTokenSSR } from 'next-firebase-auth'
import { resetServerContext } from 'react-beautiful-dnd'

import admin from '@/lib/firebase/admin'
import firebase from '@/lib/firebase/client'

import Layout from '@/components/layout/Layout'
import ModifierForm from '@/components/manage/ModifierForm'
import { toReadableClaims } from '@/hooks/useAuthClaims'

function ModifierNew() {
  const router = useRouter()
  const placeId = router.query.placeId

  return (
    <Layout
      layout="manager"
      subHeader="hide"
      metadata={{ title: "Methods" }}
    >
      <ModifierForm
        save={({ ...values }) => {
          return firebase.firestore()
            .collection(`places/${placeId}/modifiers`)
            .add(values)
        }}
      />
    </Layout>
  )
}

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(ModifierNew)

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
