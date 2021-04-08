import * as React from "react"
import Image from "next/image"

import {
  Box,
  LinkBox,
  LinkOverlay
} from "@chakra-ui/react"

export default function Logo() {
  return (
    <LinkBox>
      <LinkOverlay href="/">
        <Box position="relative" height="50px" width="120px">
          <Image src="/myresto.svg" alt="Myresto.brussels" layout="fill" objectFit="contain" />
        </Box>
      </LinkOverlay>
    </LinkBox>
  )
}
