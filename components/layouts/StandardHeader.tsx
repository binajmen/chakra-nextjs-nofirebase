import * as React from "react"

import {
  Flex,
  Spacer,
  Image,
  LinkOverlay,
  LinkBox,
} from '@chakra-ui/react'

import Container from '@/layout/Container'
import HeaderNav from '@/components/molecules/HeaderNav'

type StandardHeaderProps = {
  withMethod?: boolean
}

export default function StandardHeader({ withMethod }: StandardHeaderProps) {
  return (
    <Container p={6}>
      <Flex w="100%" align="center">
        <LinkBox>
          <LinkOverlay href="/">
            <Image boxSize="100px" objectFit="contain" src="/logo.svg" alt="Myresto.brussels" />
          </LinkOverlay>
        </LinkBox>
        <Spacer />
        <HeaderNav withMethod={withMethod} />
      </Flex>
    </Container >
  )
}
