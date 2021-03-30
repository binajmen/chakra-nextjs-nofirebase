import * as React from "react"
import useTranslation from 'next-translate/useTranslation'
import { useAuthUser } from 'next-firebase-auth'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Center,
  Text,
  Stack,
} from '@chakra-ui/react'
import { FaLocationArrow, FaSignInAlt, FaUserCog, FaChair, FaWalking, FaBicycle } from 'react-icons/fa'

import Button from '@/components/atoms/Button'

import { useStoreState, useStoreActions } from '@/store/hooks'

import type { Method } from '@/store/session'

const methods = [
  // { id: "now", label: 'now', icon: <FaChair /> },
  { id: "collect", label: 'come-collect', icon: <FaWalking /> },
  { id: "delivery", label: 'be-delivered', icon: <FaBicycle /> },
]

export default function WelcomeModal() {
  const { t } = useTranslation('common')

  const method = useStoreState(state => state.basket.method)
  const setMethod = useStoreActions(actions => actions.basket.setMethod)

  // function setMethod(method: string) {
  //   const isDone = setMethod({ method })
  //   if (!isDone) {
  //     if (window.confirm('clean basket')) {
  //       setMethod({ method, isConfirmed: true })
  //     }
  //   }
  // }

  return (
    <Modal closeOnOverlayClick={false} isOpen={method === null} onClose={() => { }} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('welcome')}</ModalHeader>
        <ModalBody>
          <Text>{t('today-choice')}</Text>
          <Center py="6">
            <Stack direction="column" spacing={3}>
              {methods.map((method, index) =>
                <Button key={index}
                  fontSize="xl"
                  leftIcon={method.icon}
                  onClick={() => setMethod(method.id)}
                >{t(method.label)}</Button>
              )}
            </Stack>
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
