import * as React from 'react'
import { AuthAction, withAuthUser, withAuthUserSSR, withAuthUserTokenSSR } from 'next-firebase-auth'
import { resetServerContext } from 'react-beautiful-dnd'
import { useRouter } from 'next/router'
import { useDocument } from '@nandorojo/swr-firestore'

import admin from '@/lib/firebase/admin'

import Layout from '@/components/layout/Layout'
import ProductForm from '@/components/manage/ProductForm'
import { Loading, Error } from '@/components/Suspense'

import type { Product } from '@/types/catalog'
import { toReadableClaims } from '@/hooks/useAuthClaims'

function ProductEdit() {
  return (
    <Layout
      layout="manager"
      subHeader="hide"
      metadata={{ title: "Methods" }}
    >
      <Content />
    </Layout>
  )
}

function Content() {
  const router = useRouter()
  const { placeId, productId } = router.query

  const product = useDocument<Product>(`places/${placeId}/products/${productId}`)

  if (product.loading) {
    return <Loading />
  } else if (product.error) {
    return <Error error={product.error} />
  } else if (product.data) {
    return (
      <ProductForm
        product={product.data}
        save={({ ...values }) => {
          return product.update(values)
        }}
      />
    )
  } else {
    return null
  }
}

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(ProductEdit)

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ query, AuthUser }) => {
  try {
    const token = await AuthUser.getIdToken()
    const decodedToken = await admin.auth().verifyIdToken(token ?? '')
    const claims = toReadableClaims(decodedToken)

    if (claims.manager && claims.managerOf.includes(query.placeId as string)) {
      return { props: {} }
    } else {
      return { notFound: true }
    }
  } catch (error) {
    console.error(error)
    return { notFound: true }
  }
})
