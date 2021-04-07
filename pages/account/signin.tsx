import * as React from "react"
import useTranslation from "next-translate/useTranslation"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import { useRouter } from "next/router"
import { withAuthUser } from "next-firebase-auth"
import { useCollection } from "@nandorojo/swr-firestore"
import type { InferGetServerSidePropsType, GetServerSideProps, GetServerSidePropsContext } from "next"

import {
  Box,
  Stack,
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
} from "@chakra-ui/react"
import { FaArrowRight } from "react-icons/fa"

import admin from "@/lib/firebase/admin"
import firebase from "@/lib/firebase/client"
import { useStoreState } from "@/store/hooks"

import Layout from "@/components/layout/Layout"
import PlacesList from "@/components/PlacesList"
import ButtonLink from "@/components/atoms/NextButton"
import WelcomeModal from "@/components/home/WelcomeModal"

import type { Place } from "@/types/place"

function SignIn() {
  const { t } = useTranslation("common")
  const router = useRouter()
  const { next } = router.query

  const firebaseUIConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => {
        onSuccess()
        return false
      }
    },
    tosUrl: "/terms-of-service",
    privacyPolicyUrl: "/privacy-policy"
  }

  function onSuccess() {
    if (next !== undefined && typeof next === "string") {
      router.push(next)
    } else {
      router.push("/account")
    }
  }

  React.useEffect(() => {
    const user = firebase.auth().currentUser
    if (user !== null)
      onSuccess()
  }, [])

  return (
    <Layout subHeader="hide">
      <Heading>Identifiez-vous</Heading>
      <StyledFirebaseAuth uiConfig={firebaseUIConfig} firebaseAuth={firebase.auth()} />
      <hr />

      <Box textAlign="center">
        OU
      </Box>
      <Heading>Créér un compte</Heading>
    </Layout>
  )
}

export default withAuthUser()(SignIn)

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return { props: {} }
}