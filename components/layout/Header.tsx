import * as React from "react"

import { Flex, Stack } from "@chakra-ui/react"

import Logo from './Logo'
import SignIn from './SignIn'
import Menu from './Menu'

export default function Header() {
  return (
    <Flex justify="space-between" alignItems="center" p="2">
      <Logo />
      <Stack direction="row" spacing="1">
        <SignIn />
        <Menu />
      </Stack>
    </Flex>
  )
}
