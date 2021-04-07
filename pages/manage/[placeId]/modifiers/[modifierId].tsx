import * as React from 'react'
import { AuthAction, withAuthUser, withAuthUserSSR } from 'next-firebase-auth'
import { resetServerContext } from 'react-beautiful-dnd'
import { useRouter } from 'next/router'
import { useDocument } from '@nandorojo/swr-firestore'

import admin from '@/lib/firebase/admin'

import Layout from '@/components/layout/Layout'
import ModifierForm from '@/components/manage/ModifierForm'
import { Loading, Error } from '@/components/Suspense'

import type { Modifier } from '@/types/catalog'

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

export const getServerSideProps = withAuthUserSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ query, AuthUser }) => {
  resetServerContext()
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
