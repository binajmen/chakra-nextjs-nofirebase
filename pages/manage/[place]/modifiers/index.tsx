import * as React from 'react'
import { useRouter } from 'next/router'
import { AuthAction, withAuthUser, withAuthUserSSR } from 'next-firebase-auth'
import { resetServerContext } from 'react-beautiful-dnd'
import useTranslation from 'next-translate/useTranslation'

import { Flex, Heading, Button, Spacer, useToast, useDisclosure } from '@chakra-ui/react'
import { FaPlus } from 'react-icons/fa'

import admin from '@/lib/firebase/admin'
import Layout from '@/components/layout/Layout'

import Categories from '@/layout/manager/Categories'
import NewCategory from '@/forms/NewCategory'

function ModifiersIndex() {
  const { t } = useTranslation('common')
  const toast = useToast()
  const modal = useDisclosure()
  const router = useRouter()
  const place = router.query.place

  return (
    <Layout
      layout="manage"
      metadata={{ title: "Modifiers" }}
    >
      <Flex mb={6}>
        <Heading>{t('categories')}</Heading>
        <Spacer />
        <Button leftIcon={<FaPlus />} color="gray.900" colorScheme="primary" onClick={modal.onOpen}>{t('manager:new-category')}</Button>
        <NewCategory modal={modal} />
      </Flex>

      <Categories />
    </Layout>
  )
}

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(ModifiersIndex)

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
