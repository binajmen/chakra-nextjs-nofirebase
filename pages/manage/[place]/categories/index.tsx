import * as React from 'react'
import { useRouter } from 'next/router'
import { AuthAction, withAuthUser, withAuthUserSSR } from 'next-firebase-auth'
import { resetServerContext } from 'react-beautiful-dnd'
import useTranslation from 'next-translate/useTranslation'

import { Flex, Heading, Button, Spacer, useToast, useDisclosure } from '@chakra-ui/react'
import { FaPlus } from 'react-icons/fa'

import { useStoreState, useStoreActions } from '@/store/hooks'

import admin from '@/lib/firebase/admin'
// import { getCategories } from '@firebase/helpers/vendors'

import Wrapper from '@/layout/Wrapper'
import Header from '@/layout/client/Header'
import ManageLayout from '@/layout/manager/Manage'

import NewCategory from '@/forms/NewCategory'

import Categories from '@/components/vendor/Categories'

import type { Categories as CategoriesType, Category } from '@/types/category'

function VendorCategories() {
  const { t } = useTranslation('common')
  const toast = useToast()
  const router = useRouter()
  const modal = useDisclosure()

  const getCategories = useStoreActions(actions => actions.categories.getCategories)

  const place = router.query.place as string

  React.useEffect(() => {
    getCategories(place)
  }, [])

  // TODO: <Vendor> title props to add in <Head>
  return (
    <Wrapper
      title="Order.brussels"
      renderHeader={() => <Header />}
    // renderFooter={() => <Footer />}
    >
      <ManageLayout>
        <Flex mb={6}>
          <Heading>{t('categories')}</Heading>
          <Spacer />
          <Button leftIcon={<FaPlus />} color="gray.900" colorScheme="primary" onClick={modal.onOpen}>{t('manager:new-category')}</Button>
          <NewCategory modal={modal} />
        </Flex>

        <Categories />

      </ManageLayout>
    </Wrapper>
  )
}

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(VendorCategories)

export const getServerSideProps = withAuthUserSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ query, AuthUser }) => {
  resetServerContext()
  try {
    // retrieve vendor id
    const { place } = query

    // retrieve roles for the current user
    const doc = await admin.firestore()
      .collection('roles')
      .doc(AuthUser.id!)
      .get()

    // if no roles or no roles for the requested vendor, 404
    if (!doc.exists || !doc.data()!.vendors?.includes(place)) return { notFound: true }

    // else
    return { props: {} }
  } catch (error) {
    console.error(error)
    return { notFound: true }
  }
})
