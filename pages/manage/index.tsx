import { useRouter } from 'next/router'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from 'next'
import { AuthAction, useAuthUser, withAuthUser, withAuthUserSSR } from 'next-firebase-auth'
import useTranslation from 'next-translate/useTranslation'

import {
  Heading
} from '@chakra-ui/react'

import { FaArrowRight } from 'react-icons/fa'

import admin from '@/lib/firebase/admin'
import Layout from '@/components/layout/Layout'

import PlacesList from '@/components/PlacesList'
import ButtonLink from '@/components/atoms/NextButton'

function PlaceIndex(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { places } = props
  const { t } = useTranslation('common')

  return (
    <Layout
      layout="manage"
      metadata={{ title: "Vos sites" }}
    >
      <Heading mb={3} size="md">Vos sites :</Heading>
      <PlacesList
        places={places}
        buttonRender={(id) => (
          <ButtonLink
            size="sm"
            color="gray.900"
            colorScheme="primary"
            variant="ghost"
            rightIcon={<FaArrowRight />}
            pathname="/manage/[place]"
            query={{ place: id }}
          >{t('manager:manage')}</ButtonLink>
        )}
      />
    </Layout>
  )
}

export default withAuthUser<InferGetServerSidePropsType<typeof getServerSideProps>>({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(PlaceIndex)

export const getServerSideProps = withAuthUserSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser }) => {
  try {
    // retrieve roles for the current user
    const roleRef = admin.firestore().collection('roles').doc(AuthUser.id!)
    const role = await roleRef.get()

    // if no roles, 404
    if (!role.exists) return { notFound: true }

    // extract places list
    const placeIds = role.data()?.places ?? []

    // if empty list, 404
    if (placeIds.length === 0) return { notFound: true }

    // retrieve places data
    // TOFIX: limit to 10 when using 'in' query
    // TOFIX: return first 10 + id list -> lazy loading at client side for the rest
    const snapshot = await admin.firestore()
      .collection('places')
      .where(admin.firestore.FieldPath.documentId(), "in", placeIds)
      .get()

    const places = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))

    return { props: { places } }
  } catch (error) {
    console.error(error)
    return { notFound: true }
  }
})
