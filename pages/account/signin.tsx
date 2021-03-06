import * as React from "react"
import useTranslation from "next-translate/useTranslation"
import type { InferGetServerSidePropsType, GetServerSideProps, GetServerSidePropsContext } from "next"

import Layout from "@/components/layout/Layout"
import SignIn from "@/components/account/SignIn"

export default function SignInPage() {
  const { t } = useTranslation("common")

  return (
    <Layout
      title={t("signing-in")}
    >
      <SignIn prefix="signin" />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return { props: {} }
}
