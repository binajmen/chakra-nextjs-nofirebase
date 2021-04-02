import * as React from 'react'
import * as Yup from 'yup'
import useTranslation from 'next-translate/useTranslation'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/router'
import { useAuthUser } from 'next-firebase-auth'
import { Formik, Form, Field, FieldProps } from 'formik'
import { useDocument } from '@nandorojo/swr-firestore'

import {
  Box,
  Flex,
  HStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  IconButton,
  Switch,
  VStack,
  Center,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Icon,
  Tr,
  Th,
  Td,
  TableCaption,
  useToast
} from '@chakra-ui/react'
import { FaCheck, FaTimes } from 'react-icons/fa'

import Button from '@/components/atoms/Button'

import firebase from '@/lib/firebase/client'

type MollieInfo = {
  access_token: string
  csrf: string
  expires_in: number
  id: string
  profileId: string
  refresh_token: string
  scope: string
  testmode: boolean
  token_type: string
  updatedAt: firebase.firestore.Timestamp
}

type MollieProfile = {
  id: string
  name: string
}

export default function SettingsMollie({ placeId }: { placeId: string }) {
  const toast = useToast()
  const router = useRouter()
  const [profiles, setProfiles] = React.useState<MollieProfile[] | null>(null)
  const { t } = useTranslation('common')
  const { data: mollieInfo, loading, error, update } = useDocument<MollieInfo>(`places/${placeId}/settings/mollie`, { listen: true })

  function connectToMollie() {
    if (window.confirm("Configure Mollie now? It will disable the current Mollie settings.")) {
      const csrf = nanoid()

      firebase.firestore().doc(`places/${placeId}/settings/mollie`)
        .set({ id: placeId, csrf: csrf })
        .catch(error => console.error(error))

      // https://docs.mollie.com/reference/oauth2/authorize
      const permissions = "payments.read payments.write profiles.read organizations.read onboarding.read"
      let url = `https://www.mollie.com/oauth2/authorize` +
        `?client_id=${process.env.NEXT_PUBLIC_MOLLIE_APP_ID}` +
        `&redirect_uri=${process.env.NEXT_PUBLIC_BASEURL}/setupMollie` +
        `&state=${csrf}` +
        `&scope=${permissions}` +
        `&response_type=code` +
        `&approval_prompt=force`

      window.open(url)
    }
  }

  function retrieveMollieProfiles() {
    let functions = null
    if (process.env.NODE_ENV === "development") {
      functions = firebase.app().functions()
    } else {
      functions = firebase.app().functions('europe-west1')
    }

    let listMollieProfiles = functions.httpsCallable('listMollieProfiles')
    listMollieProfiles({ placeId })
      .then(result => {
        console.log(result)
        setProfiles(result.data._embedded.profiles)
      })
      .catch(error => console.log(error))
  }

  function selectProfile(profileId: string) {
    firebase.firestore().doc(`places/${placeId}/settings/mollie`)
      .set({ profileId: profileId }, { merge: true })
      .catch(error => console.error(error))
  }

  if (loading) {
    return (<Text>Loading..</Text>)
  } else if (error) {
    return (<Text>Error..</Text>)
  } else if (mollieInfo) {
    return (
      <Box>
        <Heading size="lg" mb="6" borderBottom="4px solid lightgray">Mollie</Heading>
        <Flex>
          <Box id="mollie-status">
            <Heading size="md" mb="3">Current setup status:</Heading>
            <Table variant="simple" w="auto">
              <Thead>
                <Tr>
                  <Th>Mollie</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Profile</Td>
                  <Td>{mollieInfo.profileId ? <Icon as={FaCheck} color="green" /> : <Icon as={FaTimes} color="red" />}</Td>
                </Tr>
                <Tr>
                  <Td>Profile ID</Td>
                  <Td>{mollieInfo.profileId ?? "–"}</Td>
                </Tr>
                <Tr>
                  <Td>Access token</Td>
                  <Td>{mollieInfo.access_token ? <Icon as={FaCheck} color="green" /> : <Icon as={FaTimes} color="red" />}</Td>
                </Tr>
                <Tr>
                  <Td>Refresh token</Td>
                  <Td>{mollieInfo.refresh_token ? <Icon as={FaCheck} color="green" /> : <Icon as={FaTimes} color="red" />}</Td>
                </Tr>
                <Tr>
                  <Td>Scope</Td>
                  <Td>{mollieInfo.scope ? <Icon as={FaCheck} color="green" /> : <Icon as={FaTimes} color="red" />}</Td>
                </Tr>
                <Tr>
                  <Td>Last update</Td>
                  <Td>{mollieInfo.updatedAt ? new Date(mollieInfo.updatedAt.seconds * 1000).toISOString() : "–"}</Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
          <Box id="mollie-setup" px="6">
            <Box id="mollie-step-one" mb="6">
              <HStack mb="3">
                {mollieInfo.refresh_token && <Icon as={FaCheck} color="green" fontSize="xl" />}
                <Heading size="md">Step 1 – Connect to mollie</Heading>
              </HStack>
              <Button variant="ghost" colorScheme="white" padding="0" onClick={connectToMollie}>
                <img src="/static/MollieConnect.png" alt="Mollie Connect" style={{ maxHeight: "40px" }} />
              </Button>
            </Box>
            <Box id="mollie-step-two" mb="6">
              <HStack mb="3">
                {mollieInfo.profileId && <Icon as={FaCheck} color="green" fontSize="xl" />}
                <Heading size="md">Step 2 – Select your mollie profile</Heading>
              </HStack>
              <Button colorScheme="gray" onClick={retrieveMollieProfiles}>
                Retrieve your mollie profile(s)
            </Button>
              {profiles &&
                <VStack mt="6" textAlign="left" spacing="3">
                  {profiles.map((profile: MollieProfile) => (
                    <Button key={profile.id} onClick={() => selectProfile(profile.id)}>{profile.name} ({profile.id})</Button>
                  ))}
                </VStack>
              }
            </Box>
          </Box>
        </Flex>
      </Box>
    )
  } else {
    return null
  }
}
