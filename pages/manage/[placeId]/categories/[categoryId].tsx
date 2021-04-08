import * as React from 'react'
import { AuthAction, withAuthUser, withAuthUserSSR, withAuthUserTokenSSR } from 'next-firebase-auth'
import { resetServerContext } from 'react-beautiful-dnd'
import { useRouter } from 'next/router'
import { useDocument } from '@nandorojo/swr-firestore'

import admin from '@/lib/firebase/admin'

import Layout from '@/components/layout/Layout'
import CategoryForm from '@/components/manage/CategoryForm'
import { Loading, Error } from '@/components/Suspense'

import type { Category } from '@/types/catalog'
import { toReadableClaims } from '@/hooks/useAuthClaims'

function CategoryEdit() {
  return (
    <Layout
      layout="manager"
      subHeader="hide"
      metadata={{ title: "Categories" }}
    >
      <Content />
    </Layout>
  )
}

function Content() {
  const router = useRouter()
  const { placeId, categoryId } = router.query

  const category = useDocument<Category>(`places/${placeId}/categories/${categoryId}`)

  if (category.loading) {
    return <Loading />
  } else if (category.error) {
    return <Error error={category.error} />
  } else if (category.data) {
    return (
      <CategoryForm
        category={category.data}
        save={({ ...values }) => {
          return category.update(values)
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
})(CategoryEdit)

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
