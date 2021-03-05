import * as React from "react"
import Head from 'next/head'
import { useRouter } from 'next/router'
import { AuthAction, useAuthUser, withAuthUser, withAuthUserSSR } from 'next-firebase-auth'
import useTranslation from 'next-translate/useTranslation'

import {
  Flex,
  Box
} from '@chakra-ui/react'

import admin from '@/lib/firebase/admin'
import firebase from '@/lib/firebase/client'

import Wrapper from '@/layout/Wrapper'
import Header from '@/layout/client/Header'
import ManageLayout from '@/layout/manager/Manage'

function VendorIndex() {
  const [data, setData] = React.useState<any>({})
  const router = useRouter()
  const place = router.query.place as string

  React.useEffect(() => {
    firebase.firestore().collection('vendor').doc(place).get()
      .then((doc) => {
        if (doc.exists) {
          setData(doc.data())
        }
      })
      .catch(error => console.error(error))
  }, [])

  return (
    <Wrapper
      title="Order.brussels"
      renderHeader={() => <Header />}
    // renderFooter={() => <Footer />}
    >
      <ManageLayout>
        Temp
      </ManageLayout>
    </Wrapper>
  )
}

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(VendorIndex)

// https://github.com/vinissimus/next-translate/issues/487
export const getServerSideProps = withAuthUserSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ query, AuthUser }) => {
  try {
    // retrieve vendor id
    const { place } = query

    // retrieve roles for the current user
    const doc = await admin.firestore()
      .collection('roles')
      .doc(AuthUser.id!)
      .get()

    // if no roles or no roles for the requested vendor, 404
    if (!doc.exists || !doc.data()?.vendors.includes(place)) return { notFound: true }

    // else
    return { props: {} }
  } catch (error) {
    console.error(error)
    return { notFound: true }
  }
})
