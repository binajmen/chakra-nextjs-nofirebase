import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR
} from 'next-firebase-auth'

import Wrapper from '@/layout/Wrapper'
import StandardHeader from '@/components/layouts/StandardHeader'
import Footer from '@/layout/client/Footer'

import AccountAuthed from '@/components/AccountAuthed'
import AccountUnauthed from '@/components/AccountUnauthed'


function UserIndex() {
  const authUser = useAuthUser()

  return (
    <Wrapper
      title="Order.brussels"
      renderHeader={() => <StandardHeader />}
      renderFooter={() => <Footer />}
    >
      {authUser.id ? (
        <AccountAuthed />
      ) : (
        <AccountUnauthed />
      )}
    </Wrapper>
  )
}

export default withAuthUser()(UserIndex)

export function getStaticProps() { return { props: {} } }
