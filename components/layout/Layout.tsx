import * as React from 'react'
import NextHead from 'next/head'
import { useRouter } from 'next/router'

import { Flex, Box } from '@chakra-ui/react'

import Header from './Header'
import Footer from './Footer'
import ManagerNavigation from './ManagerNavigation'

import type { Place } from '@/types/place'

export type Layout = "default" | "place" | "checkout" | "manage" | "admin"

type LayoutProps = {
  children: React.ReactNode
  layout: Layout
  place?: Place | undefined
}

export default function Layout(props: LayoutProps & { metadata?: MetadataProps }) {
  const {
    children,
    metadata = {},
    ...layoutProps
  } = props

  function renderSwitch(layout: Layout) {
    switch (layout) {
      case "place":
        return <PlaceLayout {...layoutProps}>{children}</PlaceLayout>
      case "manage":
        return <ManageLayout {...layoutProps}>{children}</ManageLayout>
      case "admin":
        return <AdminLayout {...layoutProps}>{children}</AdminLayout>
      case "default":
      case "checkout":
      default:
        return <DefaultLayout {...layoutProps}>{children}</DefaultLayout>
    }
  }

  return (
    <Head {...metadata}>
      {renderSwitch(props.layout)}
    </Head>
  )
}

type MetadataProps = {
  title?: string
  description?: string
  image?: string
  type?: string
  date?: string
}

function Head(props: MetadataProps & { children: React.ReactNode }) {
  const router = useRouter()
  const { children, ...metadata } = props

  const meta = {
    title: "Myresto.brussels",
    description: "Plateforme de prise de commande équitable",
    image: 'https://myresto.brussels/static/images/banner.png',
    type: 'website',
    ...metadata
  }

  return (
    <React.Fragment>
      <NextHead>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <meta name="description" content={meta.description} />
        <meta property="og:url" content={`https://myresto.brussels${router.asPath}`} />
        <link rel="canonical" href={`https://myresto.brussels${router.asPath}`} />
        <meta property="og:type" content={meta.type} />
        <meta property="og:site_name" content="myresto.brussels" />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:image" content={meta.image} />
        {/* <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myresto.brussels" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.image} /> */}
        {meta.date && (
          <meta property="article:published_time" content={meta.date} />
        )}
      </NextHead>
      {children}
    </React.Fragment>
  )
}

function DefaultLayout({ children, ...restProps }: LayoutProps) {
  return (
    <React.Fragment>
      <Header {...restProps} />
      <Box mx="auto" w={{ base: 'full', xl: "80em" }} p="3">
        {children}
      </Box>
      <Footer {...restProps} />
    </React.Fragment>
  )
}

function PlaceLayout({ children, ...restProps }: LayoutProps) {
  return (
    <React.Fragment>
      <Header {...restProps} />
      <Box mx="auto" w={{ base: 'full', xl: "80em" }} p="3">
        {children}
      </Box>
      <Footer {...restProps} />
    </React.Fragment>
  )
}

function ManageLayout({ children, ...restProps }: LayoutProps) {
  return (
    <React.Fragment>
      <Header {...restProps} />
      <Box mx="auto" w={{ base: 'full', xl: "80em" }} p="3">
        <Flex>
          <Box pr={6} borderRight="1px solid gray">
            <ManagerNavigation />
          </Box>
          <Box pl={6} w="full">
            {children}
          </Box>
        </Flex>
      </Box>
      <Footer {...restProps} />
    </React.Fragment>
  )
}

function AdminLayout({ children, ...restProps }: LayoutProps) {
  return (
    <React.Fragment>
      <Header {...restProps} />
      <Box mx="auto" w={{ base: 'full', xl: "80em" }} p="3">
        {children}
      </Box>
      <Footer {...restProps} />
    </React.Fragment>
  )
}
