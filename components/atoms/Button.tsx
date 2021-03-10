import * as React from 'react'

import {
  Button,
  ButtonProps,
} from '@chakra-ui/react'

export default function MyButton(props: ButtonProps) {
  const { children, ...buttonProps } = props

  return (
    <Button
      color="gray.900"
      colorScheme="primary"
      variant="solid"
      {...buttonProps}
    >
      {children}
    </Button>
  )
}
