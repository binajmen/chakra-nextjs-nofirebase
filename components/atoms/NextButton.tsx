import * as React from 'react'
import NextLink from 'next/link'

import { Button, ButtonProps } from '@chakra-ui/react'

type NextButtonProps = ButtonProps & {
  pathname: string
  query?: any
}

export default function NextButton(props: NextButtonProps) {
  const { pathname, query = {}, children, ...buttonProps } = props

  return (
    <NextLink href={{ pathname, query }}>
      <Button
        color="gray.900"
        colorScheme="primary"
        variant="solid"
        {...buttonProps}
      >
        {children}
      </Button>
    </NextLink>
  )
}
