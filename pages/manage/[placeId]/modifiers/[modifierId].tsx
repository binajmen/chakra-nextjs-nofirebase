import * as React from 'react'
import { AuthAction, withAuthUser, withAuthUserSSR, withAuthUserTokenSSR } from 'next-firebase-auth'
import { resetServerContext } from 'react-beautiful-dnd'
import { useRouter } from 'next/router'
import { useDocument } from '@nandorojo/swr-firestore'

import admin from '@/lib/firebase/admin'

import Layout from '@/components/layout/Layout'
import ModifierForm from '@/components/manage/ModifierForm'
import { Loading, Error } from '@/components/Suspense'

import type { Modifier } from '@/types/catalog'
import { toReadableClaims } from '@/hooks/useAuthClaims'

function ModifierEdit() {
  return (
    <Layout
      layout="manager"
      subHeader="hide"
      metadata={{ title: "Options" }}
    >
      <Content />
    </Layout>
  )
}

function Content() {
  const router = useRouter()
  const { placeId, modifierId } = router.query

  const modifier = useDocument<Modifier>(`places/${placeId}/modifiers/${modifierId}`)

  if (modifier.loading) {
    return <Loading />
  } else if (modifier.error) {
    return <Error error={modifier.error} />
  } else if (modifier.data) {
    return (
      <ModifierForm
        modifier={modifier.data}
        save={({ ...values }) => {
          return modifier.update(values)
        }}
      />
    )
  } else {
    return null
  }
}

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(ModifierEdit)

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
