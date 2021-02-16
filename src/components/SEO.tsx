import Head from 'next/head'

export default function SEO({ description, title, siteTitle = "Order.brussels" }) {
    return (
        <Head>
            <title>{`${title} | ${siteTitle}`}</title>
            <link rel="icon" href="/favicon.ico" />
            <meta name="description" content={description} />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:site_name" content={siteTitle} />
            <meta property="twitter:card" content="summary" />
            <meta property="twitter:creator" content={siteTitle} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
        </Head>
    )
}