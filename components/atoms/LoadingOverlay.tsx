import * as React from 'react'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  Center,
  Stack,
  Spinner,
  Heading
} from '@chakra-ui/react'

type LoadingOverlayProps = {
  text?: string
}

export default function LoadingOverlay({ text }: LoadingOverlayProps) {
  return (
    <Modal isOpen={true} onClose={() => { }} isCentered>
      <ModalOverlay />
      <ModalContent bg="transparent">
        <Center>
          <Stack direction="column" alignItems="center">
            <Spinner
              thickness="3px"
              emptyColor="gray.200"
              color="#bf9900"
              size="xl"
            />
            {text && <Heading color="white" size="md">{text}</Heading>}
          </Stack>
        </Center>
      </ModalContent>
    </Modal>
  )
}
