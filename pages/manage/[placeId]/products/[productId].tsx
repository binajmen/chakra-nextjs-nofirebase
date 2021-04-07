import * as React from 'react'
import { AuthAction, withAuthUser, withAuthUserSSR } from 'next-firebase-auth'
import { resetServerContext } from 'react-beautiful-dnd'
import { useRouter } from 'next/router'
import { useDocument } from '@nandorojo/swr-firestore'

import admin from '@/lib/firebase/admin'

import Layout from '@/components/layout/Layout'
import ProductForm from '@/components/manage/ProductForm'
import { Loading, Error } from '@/components/Suspense'

import type { Product } from '@/types/catalog'

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

export const getServerSideProps = withAuthUserSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ query, AuthUser }) => {
  resetServerContext()
  try {
    // retrieve place id
    const { placeId } = query

    // retrieve roles for the current user
    const doc = await admin.firestore()
      .collection('roles')
      .doc(AuthUser.id!)
      .get()

    // if no roles or no roles for the requested place, 404
    if (!doc.exists || !doc.data()!.places?.includes(placeId)) return { notFound: true }

    // else
    return { props: {} }
  } catch (error) {
    console.error(error)
    return { notFound: true }
  }
})
