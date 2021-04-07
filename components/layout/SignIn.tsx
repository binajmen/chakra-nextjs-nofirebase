import * as React from "react"
import useTranslation from "next-translate/useTranslation"
import { useAuthUser } from "next-firebase-auth"

import { Button, IconButton, useBreakpointValue } from "@chakra-ui/react"
import { FaUserCircle } from "react-icons/fa"

export default function SignIn() {
  const user = useAuthUser()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const { t } = useTranslation("common")

  if (!isMobile) {
    if (user.id) {
      return (
        <Button
          variant="ghost"
          leftIcon={<FaUserCircle />}
        >
          {t("my-account")}
        </Button>
      )
    } else {
      return (
        <Button
          variant="ghost"
          leftIcon={<FaUserCircle />}
        >
          {t("sign-in")}
        </Button>
      )
    }
  } else {
    return null
  }
}
