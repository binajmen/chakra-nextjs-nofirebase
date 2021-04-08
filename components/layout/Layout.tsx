import * as React from "react"

import { Flex, Box, Center, Heading } from "@chakra-ui/react"

import Head, { MetadataProps } from "./Head"
import Container from "./Container"
import Header from "./Header"
import SubHeader from "./SubHeader"
import Footer from "./Footer"
import ManagerNavigation from "./ManagerNavigation"

import type { Place } from "@/types/place"
import type { SubHeaderFormat } from "./SubHeader"

type LayoutProps = {
  children: React.ReactNode
  subHeader?: SubHeaderFormat
  metadata?: MetadataProps
  padding?: boolean
  layout?: "normal" | "manager" | "admin"
  title?: string
}

export default function Layout({
  children,
  subHeader = "hide",
  metadata = {},
  padding = true,
  layout = "normal",
  title = "",
}: LayoutProps & { metadata?: MetadataProps }) {

  function renderLayout() {
    switch (layout) {
      case "manager":
        return (
          <ManageLayout>
            {children}
          </ManageLayout>
        )
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
        <SubHeader subHeader={subHeader} />
        {title && <Center><Heading my="6">{title}</Heading></Center>}
        {renderLayout()}
      </Container>
      <Footer />
    </Head>
  )
}

function ManageLayout({ children }: LayoutProps) {
  return (
    <Flex padding="2" pt="6">
      <Box pr={6} borderRight="1px solid gray">
        <ManagerNavigation />
      </Box>
      <Box pl={6} w="full">
        {children}
      </Box>
    </Flex>
  )
}
