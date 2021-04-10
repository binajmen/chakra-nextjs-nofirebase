import * as React from "react"

import { Flex, Stack } from "@chakra-ui/react"

import { useStoreActions } from "@/store/hooks"

import Logo from './Logo'
import SignIn from './SignIn'
import Menu from './Menu'

export default function Header() {
  const onUser = useStoreActions(actions => actions.user.onUser)

  React.useEffect(() => {
    const unsubscribe = onUser()
    return () => unsubscribe()
  }, [])

  return (
    <Flex justify="space-between" alignItems="center" p="2">
      <Logo />
      <Stack direction="row" spacing="1">
        {/* <SignIn /> */}
        <Menu />
      </Stack>
    </Flex>
  )
}
