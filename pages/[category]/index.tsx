import Head from 'next/head'
import { useRouter } from 'next/router'

export default function CategoryIndex() {
    const router = useRouter()
    const { category } = router.query

    return (
        <div>
            <Head>
                <title>Myresto.brussels</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div>
                Category selected: {category}
            </div>
        </div>
    )
}

CategoryIndex.getInitialProps = async () => ({
    namespacesRequired: ['common'],
})