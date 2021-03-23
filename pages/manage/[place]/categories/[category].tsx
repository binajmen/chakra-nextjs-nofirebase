import * as React from 'react'
import { AuthAction, withAuthUser, withAuthUserSSR } from 'next-firebase-auth'
import { resetServerContext } from 'react-beautiful-dnd'
import useTranslation from 'next-translate/useTranslation'

import { Flex, Heading, Button, Spacer, useDisclosure } from '@chakra-ui/react'
import { FaPlus } from 'react-icons/fa'

import admin from '@/lib/firebase/admin'
import Layout from '@/components/layout/Layout'

import Products from '@/components/manage/Products'
import NewProduct from '@/forms/NewProduct'

function PlaceCategoryProducts() {
  const { t } = useTranslation('common')
  const modal = useDisclosure()

  return (
    <Layout
      layout="manage"
      metadata={{ title: "Vos commandes" }}
    >
      <Flex mb={6}>
        <Heading>{t('categories')}</Heading>
        <Spacer />
        <Button leftIcon={<FaPlus />} color="gray.900" colorScheme="primary" onClick={modal.onOpen}>{t('manager:new-product')}</Button>
        <NewProduct modal={modal} />
      </Flex>

      <Products />
    </Layout>
  )
}

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(PlaceCategoryProducts)

export const getServerSideProps = withAuthUserSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ query, AuthUser }) => {
  resetServerContext()
  try {
    // retrieve place id
    const { place } = query

    // retrieve roles for the current user
    const doc = await admin.firestore()
      .collection('roles')
      .doc(AuthUser.id!)
      .get()

    // if no roles or no roles for the requested place, 404
    if (!doc.exists || !doc.data()!.places?.includes(place)) return { notFound: true }

    // else
    return { props: {} }
  } catch (error) {
    console.error(error)
    return { notFound: true }
  }
})
