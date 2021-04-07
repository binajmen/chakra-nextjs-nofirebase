import * as React from "react"
import { useRouter } from 'next/router'
import { AuthAction, withAuthUser, withAuthUserSSR } from 'next-firebase-auth'
import useTranslation from 'next-translate/useTranslation'

import {
  Flex,
  Box
} from '@chakra-ui/react'

import admin from '@/lib/firebase/admin'
import firebase from '@/lib/firebase/client'

import Layout from '@/components/layout/Layout'

function PlaceIndex() {
  const [data, setData] = React.useState<any>({})
  const router = useRouter()
  const place = router.query.place as string

  React.useEffect(() => {
    firebase.firestore().collection('place').doc(place).get()
      .then((doc) => {
        if (doc.exists) {
          setData(doc.data())
        }
      })
      .catch(error => console.error(error))
  }, [])

  return (
    <Layout
      layout="manager"
      subHeader="hide"
      metadata={{ title: "Vos commandes" }}
    >
      Under construction
    </Layout>
  )
}

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(PlaceIndex)

// https://github.com/vinissimus/next-translate/issues/487
export const getServerSideProps = withAuthUserSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ query, AuthUser }) => {
  try {
    // retrieve place id
    const { place } = query

    // retrieve roles for the current user
    const doc = await admin.firestore()
      .collection('roles')
      .doc(AuthUser.id!)
      .get()

    // if no roles or no roles for the requested place, 404
    if (!doc.exists || !doc.data()?.places.includes(place)) return { notFound: true }

    // else
    return { props: {} }
  } catch (error) {
    console.error(error)
    return { notFound: true }
  }
})
