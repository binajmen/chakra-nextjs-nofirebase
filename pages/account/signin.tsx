import * as React from "react"
import useTranslation from "next-translate/useTranslation"
import { withAuthUser } from "next-firebase-auth"
import type { InferGetServerSidePropsType, GetServerSideProps, GetServerSidePropsContext } from "next"

import Layout from "@/components/layout/Layout"
import SignIn from "@/components/account/SignIn"

function SignInPage() {
  const { t } = useTranslation("common")

  return (
    <Layout
      title={t("signing-in")}
    >
      <SignIn prefix="signin" />
    </Layout>
  )
}

export default withAuthUser()(SignInPage)

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return { props: {} }
}
