import { useRouter } from 'next/router'
import { AuthAction, useAuthUser, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth'
import useTranslation from 'next-translate/useTranslation'

import {
  Flex,
  Box
} from '@chakra-ui/react'

import admin from '@/lib/firebase/admin'
import Layout from '@/components/layout/Layout'
import SettingsMollie from '@/components/manage/SettingsMollie'
import { toReadableClaims } from '@/hooks/useAuthClaims'

// TODO:
// Payment (mollie)
// Notification per order type (sms)

function SettingsIndex() {
  const router = useRouter()
  const placeId = router.query.place as string

  return (
    <Layout
      layout="manager"
      subHeader="hide"
      metadata={{ title: "Vos commandes" }}
    >
      <SettingsMollie placeId={placeId} />
    </Layout>
  )
}

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(SettingsIndex)

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
