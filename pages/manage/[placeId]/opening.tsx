import * as React from 'react'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { AuthAction, withAuthUser, withAuthUserSSR } from 'next-firebase-auth'
import { useDocument } from '@nandorojo/swr-firestore'

import { Flex, Box, Heading, Button, Spacer, useToast } from '@chakra-ui/react'
import { FaSave } from 'react-icons/fa'

import admin from '@/lib/firebase/admin'

import Layout from '@/components/layout/Layout'
import SwitchOrderType from '@/components/manage/SwitchOrderType'
import Timetable from '@/components/manage/Timetable'

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

  function hasValidFormat(time: string) {
    // HH:mm format - "00:00" to "23:59"
    return /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
  }

  function isSorted(timeA: string, timeB: string) {
    // eg: "11:00" < "12:00"
    return timeA.localeCompare(timeB) === -1
  }

  function isValidSchedule(schedule: string[]) {
    // an empty schedule is always valid
    if (schedule.length === 0) return true
    // a schedule must have 2-tuples
    if (schedule.length % 2 !== 0) return false

    // a schedule must be ordered
    return schedule.every((time, index, array) => {
      // last time returns true
      if (index === array.length - 1) return true
      // must be valid format and lower than next time
      else return hasValidFormat(time) && isSorted(time, array[index + 1])
    });
  }

  function saveChanges() {
    try {
      // scan all methods / days / schedules
      Object.entries(opening).forEach(([method, days]) => {
        Object.entries(days).forEach(([day, schedule]) => {
          const isValid = isValidSchedule(schedule)
          if (!isValid)
            throw new Error(`Merci de revoir l'horaire pour le jour "${t(day)}" (${t(method)})`)
        })
      })

      // if no error thrown, save the changes
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
      layout="manager"
      subHeader="hide"
      metadata={{ title: t('opening-hours') }}
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
