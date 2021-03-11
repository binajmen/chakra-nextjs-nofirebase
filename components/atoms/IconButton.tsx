import * as React from 'react'

import {
  IconButton,
  IconButtonProps,
} from '@chakra-ui/react'

export default function MyButton(props: IconButtonProps) {
  const { children, ...buttonProps } = props

  return (
    <IconButton
      color="gray.900"
      colorScheme="primary"
      variant="solid"
      {...buttonProps}
    >
      {children}
    </IconButton>
  )
}
