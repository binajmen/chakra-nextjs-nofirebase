import { useRouter } from "next/router"
import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR
} from 'next-firebase-auth'

import Layout from '@/components/layout/Layout'

import AccountAuthed from '@/components/account/Account'

function UserIndex() {
  console.log("UserIndex render")
  return (
    <Layout
      subHeader="hide"
      metadata={{ title: "Votre compte" }}
    >
      <AccountAuthed />
    </Layout>
  )
}

export default withAuthUser({
  // whenUnauthedBeforeInit: AuthAction.REDIRECT_TO_LOGIN,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(UserIndex)

export function getStaticProps() { return { props: {} } }
