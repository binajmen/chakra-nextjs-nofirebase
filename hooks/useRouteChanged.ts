import * as React from "react"
import { useRouter } from "next/router"

const useRouteChanged = (fn: () => void) => {
  const router = useRouter()

  React.useEffect(() => {
    const handleRouteChange = (url: string) => {
      fn()
      console.log("App is changing to: ", url)
    }

    router.events.on("routeChangeStart", handleRouteChange)

    return () => {
      router.events.off("routeChangeStart", handleRouteChange)
    }
  }, [router.events, fn])
}

export default useRouteChanged