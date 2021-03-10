import * as React from 'react'
import useTranslation from 'next-translate/useTranslation'

import {
  Button,
  AlertDialog as ChakraAlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react'

type AlertDialogProps = {
  header: JSX.Element | string
  body: JSX.Element | string
  isOpen: boolean
  onCancel: () => void
  onConfirm: () => void
}

export default function AlertDialog({ header, body, isOpen, onCancel, onConfirm }: AlertDialogProps) {
  const { t } = useTranslation('common')
  const cancelRef = React.useRef(null)

  return (
    <ChakraAlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onCancel}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {header}
          </AlertDialogHeader>
          <AlertDialogBody>
            {body}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onCancel}>
              {t('cancel')}
            </Button>
            <Button colorScheme="red" onClick={onConfirm} ml="3">
              {t('continue')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </ChakraAlertDialog>
  )
}
