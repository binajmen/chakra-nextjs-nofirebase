import * as React from 'react'

import {
  Heading,
  HeadingProps,
  ThemingProps
} from '@chakra-ui/react'

type OrderIdProps = HeadingProps & {
  id: string
  expandable?: boolean
  expSize?: "4xl" | "3xl" | "2xl" | "xl" | "lg" | "md" | "sm" | "xs"
}

export default function OrderId({ id, expandable = false, expSize, ...headingProps }: OrderIdProps) {
  const [expanded, setExp] = React.useState<boolean>(false)

  function expand() {
    if (expandable)
      setExp(!expanded)
  }

  return (
    <Heading {...headingProps} onClick={expand} {...(expanded && { size: expSize ? expSize : headingProps.size })}>
      #{(expandable && !expanded) ? ".." : ""}{expanded ? id : id.slice(-5)}
    </Heading>
  )
}
