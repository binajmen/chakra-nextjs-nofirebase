import { Flex, Box, BoxProps } from '@chakra-ui/react'

import Menu from '@/layout/manager/Menu'

type PlaceLayoutProps = {
  children: React.ReactNode
}

export default function PlaceLayout({ children }: PlaceLayoutProps) {
  return (
    <Flex>
      <Box pr={6} borderRight="1px solid gray">

      </Box>
      <Box pl={6} w="full">
        {children}
      </Box>
    </Flex>
  )
}
