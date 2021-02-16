import type { AppProps /*, AppContext */ } from 'next/app'
import { ThemeProvider, theme, CSSReset } from '@chakra-ui/react'

const customTheme = {
    ...theme
}

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={customTheme}>
            <CSSReset />
            <Component {...pageProps} />
        </ThemeProvider>
    )
}

export default MyApp