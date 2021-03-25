import * as React from 'react'
import { useRouter } from 'next/router'
import { AuthAction, withAuthUser, withAuthUserSSR } from 'next-firebase-auth'
import useTranslation from 'next-translate/useTranslation'
import { useDocument } from '@nandorojo/swr-firestore'

import { Flex, Box, Heading, Button, Spacer, Text, useToast } from '@chakra-ui/react'
import { FaSave } from 'react-icons/fa'

import admin from '@/lib/firebase/admin'

import Layout from '@/components/layout/Layout'
import SwitchOrderType from '@/components/place/SwitchOrderType'
import Timetable from '@/components/place/Timetable'

import type { Place, OpeningHours } from '@/types/place'

import { METHODS } from "@/helpers/constants"

function PlaceOpeningHours() {
  const { t } = useTranslation('common')
  const toast = useToast()
  const router = useRouter()
  const placeId = router.query.placeId

  const { data: place, update } = useDocument<Place>(`places/${placeId}`)

  const [opening, setOpening] = React.useState<OpeningHours>(place?.opening ?? {})
  const [methods, setMethods] = React.useState<string[]>(place?.methods ?? [])

  React.useEffect(() => {
    if (place) {
      setOpening(place.opening)
      setMethods(place.methods)
      console.log(place)
    }
  }, [place])

  function saveChanges() {
    try {
      Object.entries(opening).forEach(([method, days]) => {
        Object.entries(days).forEach(([day, slots]) => {
          if (slots.length % 2 !== 0) throw new Error(`Uneven entries for: ${t(method)} / ${t(day)}`)
          const success = slots.every((slot, index, array) => {
            if (index === array.length - 1) return true
            else if (
              index + 1 <= array.length - 1 &&
              slot < array[index + 1] &&
              slot.length === 4 &&
              array[index + 1].length === 4
            ) return true
            else return false
          })
          if (!success) throw new Error(`Wrong format and/or order for: ${t(method)} / ${t(day)}`)
        })
      })

      update({ opening, methods })!
        .then(() => toast({
          description: t('admin:changes-saved'),
          status: "success"
        }))
        .catch((error) => { throw new Error(error) })
    } catch (error) {
      toast({
        description: error.message,
        status: "error"
      })
    }
  }

  return (
    <Layout
      layout="manage"
      metadata={{ title: "Vos commandes" }}
    >
      <Flex>
        <Heading>{t('opening-hours')}</Heading>
        <Spacer />
        <Button leftIcon={<FaSave />} color="gray.900" colorScheme="primary" onClick={saveChanges}>{t('save')}</Button>
      </Flex>

      {METHODS.map((method, index) =>
        <Box key={index} my={3} w="full">
          <Heading size="md">{t(method)}</Heading>
          <SwitchOrderType method={method} methods={methods} setMethods={setMethods} />
          <Timetable method={method} opening={opening} setOpening={setOpening} />
        </Box>
      )}
    </Layout>
  )
}

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(PlaceOpeningHours)

export const getServerSideProps = withAuthUserSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ query, AuthUser }) => {
  try {
    // retrieve place id
    const { placeId } = query

    // retrieve roles for the current user
    const doc = await admin.firestore()
      .collection('roles')
      .doc(AuthUser.id!)
      .get()

    // if no roles or no roles for the requested place, 404
    if (!doc.exists || !doc.data()!.places?.includes(placeId)) return { notFound: true }

    // else
    return { props: {} }
  } catch (error) {
    console.error(error)
    return { notFound: true }
  }
})
