import { Box, BoxProps } from '@chakra-ui/react'

type ContainerProps = BoxProps & {
  container?: "sm" | "md" | "lg" | "xl" | "full"
}

// Chakra Breakpoints
// sm: "30em"
// md: "48em"
// lg: "62em"
// xl: "80em"

export default function Container(props: ContainerProps) {
  const { children, container = "xl", ...boxProps } = props

  const widths = {
    sm: ["30em", "30em", "30em", "30em"],
    md: ["full", "48em", "48em", "48em"],
    lg: ["full", "full", "62em", "62em"],
    xl: ["full", "full", "full", "80em"],
    full: ["full"],
  }

  return (
    <Box {...boxProps} mx="auto" w={widths[container]}>
      {children}
    </Box>
  )
}
