import * as React from 'react'
import type { InferGetServerSidePropsType, GetServerSideProps, GetServerSidePropsContext } from 'next'

import {
  Text
} from '@chakra-ui/react'

import Layout from '@/components/layout/Layout'

export default function Index(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      <Text>Index</Text>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return { props: {} }
}
