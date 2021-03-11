import * as React from "react"
import useTranslation from 'next-translate/useTranslation'
import { useAuthUser } from 'next-firebase-auth'

import {
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react'
import { FaSignInAlt } from 'react-icons/fa'

import Button from '@/components/atoms/Button'
import Authentication from '@/forms/Authentication'


export default function LoginModal() {
  const { t } = useTranslation('common')
  const login = useDisclosure()

  const authUser = useAuthUser()
  const isAuthed = authUser.id !== null

  const isMobile = useBreakpointValue({ base: true, md: false })

  return (
    <React.Fragment>

      <Button
        hidden={isMobile || isAuthed}
        leftIcon={<FaSignInAlt />}
        onClick={login.onToggle}
      >
        {t('sign-in')}
      </Button>

      <Authentication modal={login} />

    </React.Fragment>
  )
}
