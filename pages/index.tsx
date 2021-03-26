import * as React from 'react'
import useTranslation from 'next-translate/useTranslation'
import { withAuthUser } from 'next-firebase-auth'
import { useCollection } from '@nandorojo/swr-firestore'
import type { InferGetServerSidePropsType, GetServerSideProps, GetServerSidePropsContext } from 'next'

import { FaArrowRight } from 'react-icons/fa'

import admin from '@/lib/firebase/admin'

import Layout from '@/components/layout/Layout'

import PlacesList from '@/components/PlacesList'
import ButtonLink from '@/components/atoms/NextButton'

import type { Place } from '@/types/place'

function Index(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation('common')
  const { data: places, error } = useCollection<Place>('places', {}, { initialData: props.places })

  return (
    <Layout layout="default">
      <PlacesList
        places={places}
        buttonRender={(id) => (
          <ButtonLink
            size="sm"
            variant="ghost"
            rightIcon={<FaArrowRight />}
            pathname="/place/[placeId]"
            query={{ placeId: id }}
          >{t('visit')}</ButtonLink>
        )}
      />
    </Layout>
  )
}

export default withAuthUser<InferGetServerSidePropsType<typeof getServerSideProps>>()(Index)

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const snapshot = await admin.firestore().collection('places').get()

    if (snapshot.empty)
      return { props: { places: [] } }

    const places = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))

    return { props: { places } }
  } catch (error) {
    console.error(error)
    return { notFound: true } // TOFIX: replace by internal server error?
  }
}
