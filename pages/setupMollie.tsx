import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

import {
  Box,
  Text,
  Progress,
} from '@chakra-ui/react'

import firebase from '@/lib/firebase/client'
import 'firebase/functions'

export default function SetupMollie() {
  const router = useRouter()

  const [message, setMessage] = React.useState<string>("")

  useEffect(() => {
    console.log(router)
    console.log(router.query)

    if ("code" in router.query && "state" in router.query) {
      let functions = null
      if (process.env.NODE_ENV === "development") {
        functions = firebase.app().functions()
      } else {
        functions = firebase.app().functions('europe-west1')
      }

      let retrieveMollieAccessToken = functions.httpsCallable('retrieveMollieAccessToken')
      retrieveMollieAccessToken(router.query) // code, state
        .then(result => {
          if (result.data.success) {
            window.close()
          } else {
            setMessage("Something went wrong.. Contact Sitback support to investigate the issue.")
          }
        })
        .catch(error => setMessage(`Error: ${error}`))
    }
  }, [router.query])

  return (
    <Box p={3}>
      <Progress isIndeterminate={!message} />
      <Text>{message}</Text>
    </Box>
  )
}
