import Head from 'next/head'
import { useRouter } from 'next/router'

import { Box } from '@chakra-ui/react'

import Container from '@/layout/Container'

type CustomMeta = {
  title?: string
  description?: string
  image?: string
  type?: string
  date?: string
}

type Layout = {
  renderHeader?: () => JSX.Element | null
  renderFooter?: () => JSX.Element | null
}

export default function Wrapper(props: React.PropsWithChildren<CustomMeta & Layout>) {
  const { children, renderHeader, renderFooter, ...customMeta } = props
  const router = useRouter()

  const meta = {
    title: "Order.brussels",
    description: "Plateforme de prise de commande équitable",
    image: 'https://order.brussels/static/images/banner.png',
    type: 'website',
    ...customMeta
  }

  return (
    <div>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <meta content={meta.description} name="description" />
        <meta property="og:url" content={`https://order.brussels${router.asPath}`} />
        <link rel="canonical" href={`https://order.brussels${router.asPath}`} />
        <meta property="og:type" content={meta.type} />
        <meta property="og:site_name" content="order.brussels" />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:image" content={meta.image} />
        {/* <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@order.brussels" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.image} /> */}
        {meta.date && (
          <meta property="article:published_time" content={meta.date} />
        )}
      </Head>
      {renderHeader && renderHeader()}
      <Container p={6}>
        {children}
      </Container>
      {renderFooter && renderFooter()}
    </div>
  )
}
