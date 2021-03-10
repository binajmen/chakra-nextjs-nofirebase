import { useRouter } from 'next/router'
import { AuthAction, useAuthUser, withAuthUser } from 'next-firebase-auth'
import useTranslation from 'next-translate/useTranslation'

import {
  Flex,
  Box
} from '@chakra-ui/react'

import admin from '@/lib/firebase/admin'
import Wrapper from '@/layout/Wrapper'
import Header from '@/layout/client/Header'
import ManageLayout from '@/layout/manager/Manage'

// TODO:
// Payment (mollie)
// Notification per order type (sms)

function PlaceIndex() {
  return (
    <Wrapper
      title="Order.brussels"
      renderHeader={() => <Header />}
    // renderFooter={() => <Footer />}
    >
      <ManageLayout>
        Under construction
      </ManageLayout>
    </Wrapper>

  )
}

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(PlaceIndex)

// https://github.com/vinissimus/next-translate/issues/487
export function getServerSideProps() { return { props: {} }; }
