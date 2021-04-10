import * as React from "react"
import * as Yup from 'yup'
import useTranslation from "next-translate/useTranslation"
import { useRouter } from "next/router"
import { Formik, Form, Field, FieldProps } from 'formik'

import {
  Flex,
  Box,
  Button,
  Stack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Icon,
  Divider,
  Heading,
  Center,
  Text,
  useToast
} from "@chakra-ui/react"
import { FaGoogle, FaFacebook, FaSignInAlt, FaPenAlt } from "react-icons/fa"

import PasswordField from "@/components/atoms/PasswordField"
import LoadingOverlay from "@/components/atoms/LoadingOverlay"
import NextButton from "@/components/atoms/NextButton"
import { useStoreActions } from "@/store/hooks"

type SignInProps = {
  prefix: string
}

export default function SignIn({ prefix }: SignInProps) {
  const { t } = useTranslation("common")
  const toast = useToast()
  const router = useRouter()
  const { next } = router.query

  const [signingUpWithGoogle, setGoogle] = React.useState(false)
  const [signingUpWithFacebook, setFacebook] = React.useState(false)
  // const [firebaseUser, setFirebaseUser] = React.useState<firebase.User | null>(null)

  const user = useStoreActions(actions => actions.user)

  function signInWithGoogle() {
    setGoogle(true)
    // let provider = new firebase.auth.GoogleAuthProvider()
    // // provider.addScope('https://www.googleapis.com/auth/contacts.readonly')
    // firebase.auth().useDeviceLanguage()
    // firebase.auth()
    //   .signInWithPopup(provider)
    //   .then((result) => {
    //     let credential = result.credential
    //     let user = result.user
    //     console.log(credential)
    //     console.log(user)
    //     setGoogle(false)
    //     setFirebaseUser(user)
    //   }).catch((error) => {
    //     // https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signinwithpopup
    //     toast({
    //       description: `${error.message} (code: ${error.code})`,
    //       status: "error"
    //     })
    //     setGoogle(false)
    //   })
  }

  // function signInWithFacebook() {
  //   setFacebook(true)
  //   let provider = new firebase.auth.FacebookAuthProvider()
  //   // provider.addScope('user_birthday')
  //   firebase.auth().useDeviceLanguage()
  //   firebase.auth()
  //     .signInWithPopup(provider)
  //     .then((result) => {
  //       let credential = result.credential
  //       let user = result.user
  //       console.log(credential)
  //       console.log(user)
  //       setFacebook(false)
  //       setFirebaseUser(user)
  //     }).catch((error) => {
  //       // https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signinwithpopup
  //       toast({
  //         description: `${error.message} (code: ${error.code})`,
  //         status: "error"
  //       })
  //       setFacebook(false)
  //     })
  // }

  // function signInWithEmailAndPassword(email: string, password: string, callback: () => void) {
  //   firebase.auth().useDeviceLanguage()
  //   firebase.auth().signInWithEmailAndPassword(email, password)
  //     .then((userCredential) => {
  //       let user = userCredential.user
  //       console.log(user)
  //       callback()
  //       setFirebaseUser(user)
  //     })
  //     .catch((error) => {
  //       if (error.code === "auth/user-not-found") {
  //         signUpWithEmailAndPassword(email, password, callback)
  //       } else {
  //         // https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signinwithemailandpassword
  //         // "auth/invalid-email"
  //         // "auth/user-disabled"
  //         // "auth/wrong-password"
  //         toast({
  //           description: `${error.message} (code: ${error.code})`,
  //           status: "error"
  //         })
  //         callback()
  //       }
  //     })
  // }

  // function signUpWithEmailAndPassword(email: string, password: string, callback: () => void) {
  //   firebase.auth().useDeviceLanguage()
  //   firebase.auth().createUserWithEmailAndPassword(email, password)
  //     .then((userCredential) => {
  //       let user = userCredential.user
  //       console.log(user)
  //       callback()
  //       setFirebaseUser(user)
  //     })
  //     .catch((error) => {
  //       let errorCode = error.code
  //       let errorMessage = error.message
  //       // https://firebase.google.com/docs/reference/js/firebase.auth.Auth#createuserwithemailandpassword
  //       // "auth/email-already-in-use"
  //       // "auth/invalid-email"
  //       // "auth/operation-not-allowed"
  //       // "auth/weak-password"
  //       toast({
  //         description: `${error.message} (code: ${error.code})`,
  //         status: "error"
  //       })
  //       callback()
  //     })
  // }

  React.useEffect(() => {
    if (signingUpWithGoogle) {
      user.setFirstName("Demo")
      user.setLastName("Demo")
      user.setEmail("demo@demo.com")
      user.setPhone("0123456789")
      user.setLocations([])
      user.setClaims({ admin: true, manager: true, managerOf: [] })
      router.push("/")
    }
    // if (firebaseUser !== null) {
    //   user.setId(firebaseUser.uid)
    //   firebase.firestore().doc(`users/${firebaseUser.uid}`).get()
    //     .then((doc) => {
    //       if (doc.exists) {
    //         const data = doc.data()
    //         // set data
    //         user.setFirstName(data?.firstName ?? "")
    //         user.setLastName(data?.lastName ?? "")
    //         user.setEmail(data?.email ?? "")
    //         user.setPhone(data?.phone ?? "")
    //         user.setLocations(data?.locations ?? [])
    //         // is the profile info complete ?
    //         if (data && data.firstName && data.email && data.phone && data.locations.length > 0) {
    //           if (next !== undefined && typeof next === "string" && next.length) {
    //             router.push(next)
    //           } else {
    //             router.push("/")
    //           }
    //         } else {
    //           console.log("profile incomplete, redirect to ref page")
    //           router.push({
    //             pathname: "/",
    //             query: { next: next ?? "/" }
    //           })
    //         }
    //       } else {
    //         console.log("no profile yet")
    //         router.push({
    //           pathname: "/",
    //           query: { next: next ?? "/" }
    //         })
    //       }
    //       setFirebaseUser(null)
    //     })
    //     .catch((error) => {
    //       toast({
    //         description: error,
    //         status: "error"
    //       })
    //       setFirebaseUser(null)
    //     })
    // }
  }, [signingUpWithGoogle])

  return (
    <Box w={["full", "md"]} mx="auto">
      {/* {firebaseUser !== null && <LoadingOverlay text="Encore quelques secondes..." />} */}
      <Stack direction="column" spacing="3">
        <Button
          colorScheme="gray"
          variant="outline"
          leftIcon={<Icon as={FaGoogle} color="red.500" />}
          isLoading={signingUpWithGoogle}
          onClick={signInWithGoogle}
        >
          {t(`${prefix}-with-google`)}
        </Button>
      </Stack>
    </Box>
  )
}
