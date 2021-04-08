// https://usehooks.com/useWindowSize/

import * as React from 'react'

export default function useAuthClaims() {
  // https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = React.useState<{ width: number, height: number }>({
    width: 0,
    height: 0,
  })

  React.useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return windowSize
}