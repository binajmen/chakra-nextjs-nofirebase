import * as React from 'react'
import { AuthAction, withAuthUser, withAuthUserSSR, withAuthUserTokenSSR } from 'next-firebase-auth'
import { resetServerContext } from 'react-beautiful-dnd'
import { useRouter } from 'next/router'
import { useDocument } from '@nandorojo/swr-firestore'

import admin from '@/lib/firebase/admin'

import Layout from '@/components/layout/Layout'
import EventForm from '@/components/manage/EventForm'
import { Loading, Error } from '@/components/Suspense'

import type { Event } from '@/types/catalog'
import { toReadableClaims } from '@/hooks/useAuthClaims'

function EventEdit() {
  return (
    <Layout
      layout="manager"
      subHeader="hide"
      metadata={{ title: "Methods" }}
    >
      <Content />
    </Layout>
  )
}

function Content() {
  const router = useRouter()
  const { placeId, eventId } = router.query

  const event = useDocument<Event>(`places/${placeId}/events/${eventId}`)

  if (event.loading) {
    return <Loading />
  } else if (event.error) {
    return <Error error={event.error} />
  } else if (event.data) {
    return (
      <EventForm
        event={event.data}
        save={({ ...values }) => {
          return event.update(values)
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
})(EventEdit)

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
