import * as React from 'react'
import { withAuthUser } from 'next-firebase-auth'
import useTranslation from 'next-translate/useTranslation'

import type { InferGetServerSidePropsType, GetServerSidePropsContext } from 'next'

import { FaArrowRight } from 'react-icons/fa'

import admin from '@/lib/firebase/admin'

import Wrapper from '@/layout/Wrapper'
import Header from '@/layout/client/Header'
import Footer from '@/layout/client/Footer'

import PlacesList from '@/components/PlacesList'
import ButtonLink from '@/components/ButtonLink'

function Index(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { places } = props
  const { t } = useTranslation('common')

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
            color="gray.900"
            colorScheme="primary"
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

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const placesRef = admin.firestore().collection('vendors')
    const snapshot = await placesRef.get()

    if (snapshot.empty) {
      return { props: { places: [] } }
    } else {
      const places = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))

      return {
        props: { places }
      }
    }
  } catch (error) {
    console.error(error)
    return { notFound: true } // TOFIX: replace by internal server error?
  }
}
