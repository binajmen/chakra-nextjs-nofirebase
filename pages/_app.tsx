import type { AppProps /*, AppContext */ } from 'next/app'
import { ChakraProvider, theme as chakraTheme, CSSReset } from '@chakra-ui/react'
import theme from '../theme'

const customTheme = {
    ...chakraTheme,
    ...theme,
}

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider theme={customTheme}>
            <CSSReset />
            <Component {...pageProps} />
        </ChakraProvider>
    )
}

export default MyApp