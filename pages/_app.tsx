import { StoreProvider } from 'easy-peasy'
import { FuegoProvider } from '@nandorojo/swr-firestore'
import { extendTheme, ChakraProvider, CSSReset } from '@chakra-ui/react'

import type { AppProps /*, AppContext */ } from 'next/app'

import fuego from '@/lib/firebase/fuego'
import initAuth from '@/lib/firebase/auth'

import { useStore } from '@/store/index'

import theme from '../theme'
export const customTheme = extendTheme(theme)

initAuth()

export default function MyApp({ Component, pageProps }: AppProps) {
  const store = useStore(pageProps.ssrStoreState)

  return (
    <FuegoProvider fuego={fuego}>
      <StoreProvider store={store}>
        <ChakraProvider theme={customTheme}>
          <CSSReset />
          <Component {...pageProps} />
        </ChakraProvider>
      </StoreProvider>
    </FuegoProvider>
  )
}
