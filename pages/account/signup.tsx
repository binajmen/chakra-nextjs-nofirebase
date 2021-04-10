import * as React from "react"
import useTranslation from "next-translate/useTranslation"
import { withAuthUser } from "next-firebase-auth"
import type { InferGetServerSidePropsType, GetServerSideProps, GetServerSidePropsContext } from "next"

import Layout from "@/components/layout/Layout"
import SignIn from "@/components/account/SignIn"


function SignUp() {
  const { t } = useTranslation("common")

  return (
    <Layout
      title={t("signing-up")}
    >
      <SignIn prefix="signup" />
    </Layout>
  )
}

export default withAuthUser()(SignUp)

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return { props: {} }
}