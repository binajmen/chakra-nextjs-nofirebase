import * as React from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import useTranslation from 'next-translate/useTranslation'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'

import firebase from '@/lib/firebase/client'

export type AuthenticationProps = {
  modal: ReturnType<typeof useDisclosure>
}

export default function Authentication({ modal }: AuthenticationProps) {
  const { t } = useTranslation('common')

  const firebaseUIConfig = {
    signInFlow: 'popup',
    signInSuccessUrl: '/',
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],
    signInSuccess: () => {
      modal.onClose()
      return false
    },
    tosUrl: '/terms-of-service',
    privacyPolicyUrl: '/privacy-policy'
  }

  return (
    <Modal size="md" isOpen={modal.isOpen} onClose={modal.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('sign-in')}</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <StyledFirebaseAuth uiConfig={firebaseUIConfig} firebaseAuth={firebase.auth()} />
        </ModalBody>

        {/* <ModalFooter>
                    <VStack width="full">
                        <Button
                            type="submit"
                            width="full"
                            colorScheme="primary"
                            isLoading={props.isSubmitting}
                        >Sign In</Button>
                        <Button variant="link">Forgot your password?</Button>
                    </VStack>
                </ModalFooter> */}
      </ModalContent>
    </Modal>
  )
}
