import * as React from 'react'
import { withAuthUser } from 'next-firebase-auth'
import type { InferGetServerSidePropsType, GetServerSideProps, GetServerSidePropsContext } from 'next'

import {
  Text
} from '@chakra-ui/react'

import Layout from '@/components/layout/Layout'

function Index(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      <Text>Index</Text>
    </Layout>
  )
}

export default withAuthUser<InferGetServerSidePropsType<typeof getServerSideProps>>()(Index)

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return { props: {} }
}
