import * as React from 'react'
import NextLink from 'next/link'

import { ButtonProps } from '@chakra-ui/react'

import Button from './Button'

type NextButtonProps = ButtonProps & {
  pathname: string
  query?: any
}

export default function NextButton(props: NextButtonProps) {
  const { pathname, query = {}, children, ...buttonProps } = props

  return (
    <NextLink href={{ pathname, query }}>
      <Button {...buttonProps}>
        {children}
      </Button>
    </NextLink>
  )
}
