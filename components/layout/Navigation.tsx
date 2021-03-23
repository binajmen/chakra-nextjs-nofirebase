import * as React from "react"
import useTranslation from 'next-translate/useTranslation'
import { useAuthUser } from 'next-firebase-auth'

import {
  HStack,
  useBreakpointValue,
} from '@chakra-ui/react'
import { FaUserCog } from 'react-icons/fa'

import NextButton from '@/components/atoms/NextButton'
import MethodMenu from '@/components/molecules/MethodMenu'
import LoginModal from '@/components/molecules/LoginModal'
import MenuDrawer from '@/components/organisms/MenuDrawer'

type NavigationProps = {
  withCover?: boolean
  withMethod?: boolean
}

export default function Navigation({
  withCover = false,
  withMethod = true
}: NavigationProps) {
  const { t } = useTranslation('common')

  const authUser = useAuthUser()
  const isAuthed = authUser.id !== null

  const isMobile = useBreakpointValue({ base: true, md: false })

  return (
    <HStack spacing={3}>
      {withMethod && <MethodMenu />}

      <NextButton
        pathname="/account"
        hidden={isMobile || !isAuthed}
        leftIcon={<FaUserCog />}
      >
        {t('menu-account')}
      </NextButton>

      <LoginModal />

      <MenuDrawer withCover={withCover} />
    </HStack>
  )
}
