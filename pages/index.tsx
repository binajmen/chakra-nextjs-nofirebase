import * as React from 'react'
import useTranslation from 'next-translate/useTranslation'
import { withAuthUser } from 'next-firebase-auth'
import { useCollection } from '@nandorojo/swr-firestore'
import type { InferGetServerSidePropsType, GetServerSideProps, GetServerSidePropsContext } from 'next'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Heading,
  Center,
  Text
} from '@chakra-ui/react'
import { FaArrowRight } from 'react-icons/fa'

import admin from '@/lib/firebase/admin'
import { useStoreState } from '@/store/hooks'

import Layout from '@/components/layout/Layout'
import PlacesList from '@/components/PlacesList'
import ButtonLink from '@/components/atoms/NextButton'
import WelcomeModal from '@/components/home/WelcomeModal'

import type { Place } from '@/types/place'

function Index(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation('common')
  const method = useStoreState(state => state.basket.method)

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
            pathname={`/place/[placeId]${method ? "/[catalogId]" : ""}`}
            query={{ placeId: id, catalogId: method as string }}
          >{t('visit')}</ButtonLink>
        )}
      />

      <Modal closeOnOverlayClick={false} isOpen={method === null} onClose={() => { }} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Bienvenue !</ModalHeader>
          <ModalBody>
            <Text>Aujourd'hui, j'aimerais passer une commande ...</Text>
            <Center><WelcomeModal /></Center>
          </ModalBody>
          <ModalFooter>
            <Text>En utilisant </Text>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
