import * as React from 'react'
import { withAuthUser } from 'next-firebase-auth'

import Layout from '@/components/layout/Layout'
import Orders from '@/components/Orders'

function OrdersIndex() {
  return (
    <Layout
      subHeader="hide"
      metadata={{ title: "Vos commandes" }}
    >
      <Orders />
    </Layout>
  )
}

export default withAuthUser()(OrdersIndex)

export function getStaticProps() { return { props: {} } }
