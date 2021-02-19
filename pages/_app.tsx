import { StoreProvider } from 'easy-peasy'
import { extendTheme, ChakraProvider, CSSReset } from '@chakra-ui/react'

import type { AppProps /*, AppContext */ } from 'next/app'

import theme from '../theme'
import { useStore } from '../src/store'

const customTheme = extendTheme(theme)

export default function MyApp({ Component, pageProps }: AppProps) {
    const store = useStore(pageProps.ssrStoreState)

    return (
        <StoreProvider store={store}>
            <ChakraProvider theme={customTheme}>
                <CSSReset />
                <Component {...pageProps} />
            </ChakraProvider>
        </StoreProvider>
    )
}