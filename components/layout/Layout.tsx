import * as React from "react"

import { Flex, Box, Center, Heading } from "@chakra-ui/react"

import Head, { MetadataProps } from "./Head"
import Container from "./Container"
import Header from "./Header"

type LayoutProps = {
  children: React.ReactNode
  metadata?: MetadataProps
  padding?: boolean
  layout?: "normal" | "manager" | "admin"
  title?: string
}

export default function Layout({
  children,
  metadata = {},
  padding = true,
  layout = "normal",
  title = "",
}: LayoutProps & { metadata?: MetadataProps }) {

  function renderLayout() {
    switch (layout) {
      default:
        return (
          <Box padding={padding ? 2 : 0}>
            {children}
          </Box>
        )
    }
  }

  return (
    <Head {...metadata}>
      <Container>
        <Header />
        {title && <Center><Heading my="6">{title}</Heading></Center>}
        {renderLayout()}
      </Container>
    </Head>
  )
}
