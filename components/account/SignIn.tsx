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

import firebase from "@/lib/firebase/client"

import PasswordField from "@/components/atoms/PasswordField"
import LoadingOverlay from "@/components/atoms/LoadingOverlay"
import NextButton from "@/components/atoms/NextButton"

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
  const [user, setUser] = React.useState<firebase.User | null>(null)

  function signInWithGoogle() {
    setGoogle(true)
    let provider = new firebase.auth.GoogleAuthProvider()
    // provider.addScope('https://www.googleapis.com/auth/contacts.readonly')
    firebase.auth().useDeviceLanguage()
    firebase.auth()
      .signInWithPopup(provider)
      .then((result) => {
        let credential = result.credential
        let user = result.user
        console.log(credential)
        console.log(user)
        setGoogle(false)
        setUser(user)
      }).catch((error) => {
        // https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signinwithpopup
        toast({
          description: `${error.message} (code: ${error.code})`,
          status: "error"
        })
        setGoogle(false)
      })
  }

  function signInWithFacebook() {
    setFacebook(true)
    let provider = new firebase.auth.FacebookAuthProvider()
    // provider.addScope('user_birthday')
    firebase.auth().useDeviceLanguage()
    firebase.auth()
      .signInWithPopup(provider)
      .then((result) => {
        let credential = result.credential
        let user = result.user
        console.log(credential)
        console.log(user)
        setFacebook(false)
        setUser(user)
      }).catch((error) => {
        // https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signinwithpopup
        toast({
          description: `${error.message} (code: ${error.code})`,
          status: "error"
        })
        setFacebook(false)
      })
  }

  function signInWithEmailAndPassword(email: string, password: string, callback: () => void) {
    firebase.auth().useDeviceLanguage()
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        let user = userCredential.user
        console.log(user)
        callback()
        setUser(user)
      })
      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          signUpWithEmailAndPassword(email, password, callback)
        } else {
          // https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signinwithemailandpassword
          // "auth/invalid-email"
          // "auth/user-disabled"
          // "auth/wrong-password"
          toast({
            description: `${error.message} (code: ${error.code})`,
            status: "error"
          })
          callback()
        }
      })
  }

  function signUpWithEmailAndPassword(email: string, password: string, callback: () => void) {
    firebase.auth().useDeviceLanguage()
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        let user = userCredential.user
        console.log(user)
        callback()
        setUser(user)
      })
      .catch((error) => {
        let errorCode = error.code
        let errorMessage = error.message
        // https://firebase.google.com/docs/reference/js/firebase.auth.Auth#createuserwithemailandpassword
        // "auth/email-already-in-use"
        // "auth/invalid-email"
        // "auth/operation-not-allowed"
        // "auth/weak-password"
        toast({
          description: `${error.message} (code: ${error.code})`,
          status: "error"
        })
        callback()
      })
  }

  React.useEffect(() => {
    if (user !== null) {
      firebase.firestore().doc(`users/${user.uid}`).get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data()
            // is the profile info complete ?
            if (data && data.firstName && data.email && data.phone && data.locations.length > 0) {
              console.log("profile complete, redirect to ref page")
              if (next !== undefined && typeof next === "string" && next.length) {
                router.push(next)
              } else {
                router.push("/")
              }
            } else {
              console.log("profile incomplete, redirect to ref page")
              router.push({
                pathname: "/account/complete",
                query: { next }
              })
            }
          } else {
            console.log("no profile yet")
            router.push({
              pathname: "/account/complete",
              query: { next }
            })
          }
          setUser(null)
        })
        .catch((error) => {
          toast({
            description: error,
            status: "error"
          })
          setUser(null)
        })
    }
  }, [user])

  return (
    <Box w={["full", "md"]} mx="auto">
      {user !== null && <LoadingOverlay text="Encore quelques secondes..." />}
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
        <Button
          colorScheme="gray"
          variant="outline"
          leftIcon={<Icon as={FaFacebook} color="facebook.500" />}
          isLoading={signingUpWithFacebook}
          onClick={signInWithFacebook}
        >
          {t(`${prefix}-with-facebook`)}
        </Button>
        <Flex alignItems="center">
          <Divider />
          <Text px="3">{t("OR")}</Text>
          <Divider />
        </Flex>
        <Box>
          <Formik
            initialValues={{
              email: "",
              password: ""
            }}
            validationSchema={Yup.object({
              email: Yup.string().email().required(),
              password: Yup.string().min(8).required(),
            })}
            onSubmit={(values, actions) => {
              signInWithEmailAndPassword(
                values.email,
                values.password,
                () => actions.setSubmitting(false)
              )
            }}
          >
            {(props) => (
              <Form>
                <Stack flex="1" direction="column" spacing="6">
                  <Field name="email">
                    {({ field, form, meta }: FieldProps) => (
                      <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                        <FormLabel htmlFor="email">{t('email')}</FormLabel>
                        <Input {...field} type="email" id="email" placeholder="" />
                        <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="password">
                    {({ field, form, meta }: FieldProps) => (
                      <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
                        <FormLabel htmlFor="password">{t('password')}</FormLabel>
                        <PasswordField
                          {...field}
                          id="password"
                          placeholder=""
                        />
                        <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Stack direction="column" alignItems="center">
                    <Button
                      type="submit"
                      color="black"
                      colorScheme="primary"
                      leftIcon={<FaSignInAlt />}
                      isLoading={props.isSubmitting}
                    >
                      {t(`${prefix}`)}
                    </Button>
                    {prefix === "signin" &&
                      <NextButton
                        size="sm"
                        variant="link"
                        colorScheme="gray"
                        pathname="/account/forgot-password"
                      >
                        Mot de passe oublié ?
                      </NextButton>
                    }
                  </Stack>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
        {prefix === "signin" &&
          <React.Fragment>
            <Divider py="3" mb="3" />
            <Stack direction="column" alignItems="center" spacing="6">
              <Heading size="lg">Pas encore inscrit ?</Heading>
              <NextButton
                color="black"
                colorScheme="primary"
                leftIcon={<FaPenAlt />}
                pathname="/account/signup"
                query={{ ...router.query }}
              >
                Inscrivez-vous !
          </NextButton>
              <Text fontSize="md" textAlign="center">Cela ne vous prendra pas plus de 30 secondes et vous permettra d'économiser un temps précieux lors de vos prochaines commandes !</Text>
            </Stack>
          </React.Fragment>
        }
      </Stack>
    </Box>
  )
}
