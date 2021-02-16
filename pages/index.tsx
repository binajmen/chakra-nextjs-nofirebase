import Head from 'next/head'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { Link } from '@chakra-ui/react'

import NavBar from '../src/components/NavBar'

export default function Home() {
    const router = useRouter()
    const { locale, locales, defaultLocale } = router

    return (
        <div>
            <Head>
                <title>Myresto.brussels</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <NavBar />
            <div>
                <h1>Hello, world!</h1>
                <p>Welcome to your internationalised page!</p>
                <br />
                <p>Current locale: {locale}</p>
                <p>Default locale: {defaultLocale}</p>
                <p>Configured locales: {JSON.stringify(locales)}</p>
                <br />
                <NextLink href="/test" passHref>
                    <Link color="teal.500">Check the test page</Link>
                </NextLink>
            </div>
        </div>
    )
}
