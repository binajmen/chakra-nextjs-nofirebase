import { StoreProvider } from 'easy-peasy'
import { extendTheme, ChakraProvider, CSSReset } from '@chakra-ui/react'

import type { AppProps /*, AppContext */ } from 'next/app'


import { useStore } from '@/store/index'

import theme from '../theme'
export const customTheme = extendTheme(theme)


export default function MyApp({ Component, pageProps, router }: AppProps) {
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
