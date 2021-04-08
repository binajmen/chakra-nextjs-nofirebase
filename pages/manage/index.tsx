import { useRouter } from 'next/router'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from 'next'
import { AuthAction, useAuthUser, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth'
import useTranslation from 'next-translate/useTranslation'

import {
  Heading
} from '@chakra-ui/react'

import { FaArrowRight } from 'react-icons/fa'

import admin from '@/lib/firebase/admin'
import Layout from '@/components/layout/Layout'
import PlacesList from '@/components/PlacesList'
import ButtonLink from '@/components/atoms/NextButton'
import { toReadableClaims } from "@/hooks/useAuthClaims"

function PlaceIndex(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { places } = props
  const { t } = useTranslation('common')

  return (
    <Layout
      subHeader="hide"
      metadata={{ title: "Vos sites" }}
      title="Manage"
    >
      <PlacesList
        places={places}
        buttonRender={(id) => (
          <ButtonLink
            size="sm"
            color="gray.900"
            colorScheme="primary"
            variant="ghost"
            rightIcon={<FaArrowRight />}
            pathname="/manage/[placeId]"
            query={{ placeId: id }}
          >{t('admin:manage')}</ButtonLink>
        )}
      />
    </Layout>
  )
}

export default withAuthUser<InferGetServerSidePropsType<typeof getServerSideProps>>({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(PlaceIndex)

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser }) => {
  const token = await AuthUser.getIdToken()
  const decodedToken = await admin.auth().verifyIdToken(token ?? '')
  const claims = toReadableClaims(decodedToken)

  // TOFIX: handle > 10
  if (claims.manager && claims.managerOf.length < 10) {
    const snapshot = await admin.firestore()
      .collection('places')
      .where(admin.firestore.FieldPath.documentId(), "in", claims.managerOf)
      .get()

    const places = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))

    return { props: { places } }
  } else {
    return { notFound: true }
  }
})
