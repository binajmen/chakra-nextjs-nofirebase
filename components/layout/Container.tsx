import { Box, BoxProps } from '@chakra-ui/react'

export default function Container(props: React.PropsWithChildren<BoxProps>) {
  const { children, ...boxProps } = props

  return (
    <Box
      {...boxProps}
      mx="auto"
      w={{ base: 'full', "2xl": "96em" }}
    >
      {children}
    </Box>
  )
}
