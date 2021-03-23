import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR
} from 'next-firebase-auth'

import Layout from '@/components/layout/Layout'

import AccountAuthed from '@/components/AccountAuthed'
import AccountUnauthed from '@/components/AccountUnauthed'


function UserIndex() {
  const authUser = useAuthUser()

  return (
    <Layout
      layout="default"
      metadata={{ title: "Votre compte" }}
    >
      {authUser.id ? (
        <AccountAuthed />
      ) : (
        <AccountUnauthed />
      )}
    </Layout>
  )
}

export default withAuthUser()(UserIndex)

export function getStaticProps() { return { props: {} } }
