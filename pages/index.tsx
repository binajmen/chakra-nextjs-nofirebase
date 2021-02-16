import Head from 'next/head'
import { useRouter } from 'next/router'

import styles from '../styles/Home.module.css'

export default function Home() {
    const router = useRouter()
    const { locale, locales, defaultLocale } = router

    return (
        <div className={styles.container}>
            <Head>
                <title>Myresto.brussels</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div>
                <h1>Hello, world!</h1>
                <p>Welcome to your internationalised page!</p>
                <br />
                <p>Current locale: {locale}</p>
                <p>Default locale: {defaultLocale}</p>
                <p>Configured locales: {JSON.stringify(locales)}</p>
            </div>
        </div>
    )
}
