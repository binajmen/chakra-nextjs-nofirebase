import * as React from 'react'

import {
  Button,
  ButtonProps,
} from '@chakra-ui/react'

type MyButtonProps = ButtonProps & {
  // primary?: boolean // default
  secondary?: boolean
  alert?: boolean
}

export default function MyButton({
  children,
  // primary = false,
  secondary = false,
  alert = false,
  ...buttonProps
}: MyButtonProps) {
  if (secondary) {
    return
  }
  return (
    <Button
      colorScheme="primary"
      variant="solid"
      {...buttonProps}
    >
      {children}
    </Button>
  )
}
