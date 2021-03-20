import * as React from 'react'
import { withAuthUser } from 'next-firebase-auth'

import Wrapper from '@/layout/Wrapper'
import StandardHeader from '@/components/layouts/StandardHeader'
import Footer from '@/layout/client/Footer'
import Orders from '@/components/Orders'

function OrdersIndex() {
  return (
    <Wrapper
      title="Order.brussels"
      renderHeader={() => <StandardHeader withMethod={false} />}
      renderFooter={() => <Footer />}
    >
      <Orders />
    </Wrapper>
  )
}

export default withAuthUser()(OrdersIndex)

export function getStaticProps() { return { props: {} } }
