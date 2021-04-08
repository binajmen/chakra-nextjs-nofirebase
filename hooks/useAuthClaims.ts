import * as React from 'react'
import firebase from "@/lib/firebase/client"

type AuthClaims = {
  admin: boolean
  manager: boolean
  managerOf: string[]
}

const emptyClaims: AuthClaims = {
  admin: false,
  manager: false,
  managerOf: []
}

export default function useAuthClaims() {
  const currentUser = firebase.auth().currentUser
  const [claims, setClaims] = React.useState<AuthClaims>(emptyClaims)

  React.useEffect(() => {
    if (currentUser) {
      currentUser.getIdTokenResult()
        .then((idTokenResult) => {
          setClaims(toReadableClaims(idTokenResult.claims))
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }, [currentUser])

  return claims
}

export function toReadableClaims(idTokenResultClaims: { [key: string]: any }) {
  let claims = { ...emptyClaims }

  if ("a" in idTokenResultClaims) claims.admin = idTokenResultClaims.a
  if ("m" in idTokenResultClaims) {
    claims.manager = idTokenResultClaims.m.length > 0
    claims.managerOf = idTokenResultClaims.m
  }

  return claims
}
