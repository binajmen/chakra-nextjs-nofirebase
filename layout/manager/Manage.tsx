import { Flex, Box, BoxProps } from '@chakra-ui/react'

import Menu from '@/layout/manager/Menu'

type ManageProps = {
  children: React.ReactNode
}

export default function Manage({ children }: ManageProps) {
  return (
    <Flex>
      <Box pr={6} borderRight="1px solid gray"><Menu /></Box>
      <Box pl={6} w="full">
        {children}
      </Box>
    </Flex>
  )
}
