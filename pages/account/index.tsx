import { useRouter } from "next/router"

import Layout from '@/components/layout/Layout'

import AccountAuthed from '@/components/account/Account'

export default function UserIndex() {
  console.log("UserIndex render")
  return (
    <Layout>
      <AccountAuthed />
    </Layout>
  )
}

export function getStaticProps() { return { props: {} } }
