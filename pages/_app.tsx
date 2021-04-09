import { AnimatePresence, motion } from 'framer-motion'
import { StoreProvider } from 'easy-peasy'
import { FuegoProvider } from '@nandorojo/swr-firestore'
import { extendTheme, ChakraProvider, CSSReset } from '@chakra-ui/react'

import type { AppProps /*, AppContext */ } from 'next/app'

import { useTransitionFix } from '@/hooks/useTransitionFix'

import fuego from '@/lib/firebase/fuego'
import initAuth from '@/lib/firebase/auth'

import { useStore } from '@/store/index'

import theme from '../theme'
export const customTheme = extendTheme(theme)

initAuth()

const PAGE_VARIANTS = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
}

export default function MyApp({ Component, pageProps, router }: AppProps) {
  const transitionCallback = useTransitionFix()
  const store = useStore(pageProps.ssrStoreState)

  return (
    <FuegoProvider fuego={fuego}>
      <StoreProvider store={store}>
        <ChakraProvider theme={customTheme}>
          <CSSReset />
          {/* <AnimatePresence exitBeforeEnter onExitComplete={transitionCallback}>
            <motion.div
              key={router.route}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={PAGE_VARIANTS}
            > */}
          <Component {...pageProps} />
          {/* </motion.div>
          </AnimatePresence> */}
        </ChakraProvider>
      </StoreProvider>
    </FuegoProvider>
  )
}
