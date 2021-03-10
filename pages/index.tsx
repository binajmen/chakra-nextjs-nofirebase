import * as React from 'react'
import { withAuthUser } from 'next-firebase-auth'
import useTranslation from 'next-translate/useTranslation'
import { useCollection } from '@nandorojo/swr-firestore'

import type {
  InferGetServerSidePropsType,
  GetServerSideProps,
  GetServerSidePropsContext
} from 'next'
import type { Place } from '@/types/place'

import { FaArrowRight } from 'react-icons/fa'

import admin from '@/lib/firebase/admin'
import Wrapper from '@/layout/Wrapper'
import Header from '@/layout/client/Header'
import Footer from '@/layout/client/Footer'
import PlacesList from '@/components/PlacesList'
import ButtonLink from '@/components/atoms/NextButton'

function Index(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation('common')
  const { data: places, error } = useCollection<Place>('places', {}, { initialData: props.places })

  return (
    <Wrapper
      title="Order.brussels"
      renderHeader={() => <Header />}
      renderFooter={() => <Footer />}
    >
      <PlacesList
        places={places}
        buttonRender={(id) => (
          <ButtonLink
            size="sm"
            variant="ghost"
            rightIcon={<FaArrowRight />}
            pathname="/place/[place]"
            query={{ place: id }}
          >{t('visit')}</ButtonLink>
        )}
      />
    </Wrapper>
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
