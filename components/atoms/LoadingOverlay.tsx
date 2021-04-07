import * as React from 'react'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  Center,
  Spinner
} from '@chakra-ui/react'

export default function LoadingOverlay() {
  return (
    <Modal isOpen={true} onClose={() => { }} isCentered>
      <ModalOverlay />
      <ModalContent bg="transparent">
        <Center>
          <Spinner
            thickness="3px"
            emptyColor="gray.200"
            color="#bf9900"
            size="xl"
          />
        </Center>
      </ModalContent>
    </Modal>
  )
}
