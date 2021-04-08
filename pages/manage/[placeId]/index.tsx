import * as React from "react"
import { useRouter } from 'next/router'
import { AuthAction, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth'
import useTranslation from 'next-translate/useTranslation'

import {
  Flex,
  Box
} from '@chakra-ui/react'

import admin from '@/lib/firebase/admin'
import firebase from '@/lib/firebase/client'

import Layout from '@/components/layout/Layout'
import { toReadableClaims } from "@/hooks/useAuthClaims"

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

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ query, AuthUser }) => {
  try {
    const token = await AuthUser.getIdToken()
    const decodedToken = await admin.auth().verifyIdToken(token ?? '')
    const claims = toReadableClaims(decodedToken)

    console.log(claims)
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
