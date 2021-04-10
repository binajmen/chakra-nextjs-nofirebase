import * as React from 'react'
import NextHead from 'next/head'
import { useRouter } from 'next/router'

export type MetadataProps = {
  title?: string
  description?: string
  image?: string
  type?: string
  date?: string
}

export default function Head({
  children,
  ...metadata
}: React.PropsWithChildren<MetadataProps>) {
  const router = useRouter()

  const meta = {
    title: "Sandbox",
    description: "Sandbox",
    type: 'website',
    ...metadata
  }

  return (
    <React.Fragment>
      <NextHead>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <meta name="description" content={meta.description} />
        <meta property="og:type" content={meta.type} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:image" content={meta.image} />
        {/* <meta name="twitter:card" content="summary_large_image" />
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
