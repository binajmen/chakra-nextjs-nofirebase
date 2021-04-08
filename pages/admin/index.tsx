import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR
} from 'next-firebase-auth'

import admin from '@/lib/firebase/admin'

import Layout from '@/components/layout/Layout'

export type AdminIndexProps = {
  admin: boolean
}

function AdminIndex({ admin }: AdminIndexProps) {
  const authUser = useAuthUser()

  return (
    <Layout
      subHeader="hide"
      metadata={{ title: "Vos commandes" }}
    >
      Welcome {authUser.email}!
    </Layout>
  )
}

export default withAuthUser<AdminIndexProps>({
  whenUnauthedBeforeInit: AuthAction.REDIRECT_TO_LOGIN,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(AdminIndex)

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser }) => {
  const token = await AuthUser.getIdToken()
  const decodedToken = await admin.auth().verifyIdToken(token ?? '')

  if (decodedToken.a) {
    return { props: {} }
  } else {
    return { notFound: true }
  }
})
