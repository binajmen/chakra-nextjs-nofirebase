import * as React from 'react'
import Link from 'next/link'

import { Button, ButtonProps } from "@chakra-ui/react"

type NextButtonProps = ButtonProps & {
  children: React.ReactNode
  pathname: string
  query?: any
}

export default function NextButton(props: NextButtonProps) {
  const { children, pathname, query = {}, ...buttonProps } = props

  return (
    <Link href={{ pathname, query }}>
      <Button {...buttonProps}>
        {children}
      </Button>
    </Link>
  )
}
