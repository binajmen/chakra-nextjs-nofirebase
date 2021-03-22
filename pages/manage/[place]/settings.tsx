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

import SettingsMollie from '@/components/manage/SettingsMollie'

// TODO:
// Payment (mollie)
// Notification per order type (sms)

function SettingsIndex() {
  const router = useRouter()
  const placeId = router.query.place as string

  return (
    <Wrapper
      title="Order.brussels"
      renderHeader={() => <Header />}
    // renderFooter={() => <Footer />}
    >
      <ManageLayout>
        <SettingsMollie placeId={placeId} />
      </ManageLayout>
    </Wrapper>
  )
}

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(SettingsIndex)

// https://github.com/vinissimus/next-translate/issues/487
export function getServerSideProps() { return { props: {} }; }
