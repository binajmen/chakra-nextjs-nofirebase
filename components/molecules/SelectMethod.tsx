import * as React from "react"
import useTranslation from 'next-translate/useTranslation'
import { useAuthUser } from 'next-firebase-auth'

import {
  Box,
  Flex,
  Spacer,
  Stack,
  HStack,
  Link,
  Button,
  IconButton,
  Heading,
  Text,
  Image,
  useBreakpointValue,
  useDisclosure,
  Collapse
} from '@chakra-ui/react'
import { FaLocationArrow, FaSignInAlt, FaUserCog, FaChair, FaWalking, FaBicycle } from 'react-icons/fa'

import { useStoreState, useStoreActions } from '@/store/hooks'

import type { Method } from '@/store/session'

const methods = [
  // { label: 'now', icon: <FaChair /> },
  { label: 'collect', icon: <FaWalking /> },
  { label: 'delivery', icon: <FaBicycle /> },
]

export default function SelectMethod() {
  const { t } = useTranslation('common')
  const setMethod = useStoreActions(actions => actions.basket.setMethod)

  function _setMethod(method: string) {
    const isDone = setMethod({ method })
    if (!isDone) {
      if (window.confirm('clean basket')) {
        setMethod({ method, isConfirmed: true })
      }
    }
  }

  return (
    <Stack direction={['column', 'row']} spacing={3}>
      {methods.map((method, index) =>
        <Button key={index}
          textColor="gray.900"
          colorScheme="primary"
          fontSize="xl"
          leftIcon={method.icon}
          onClick={() => _setMethod(method.label)}
        >{t(method.label)}</Button>
      )}
    </Stack>
  )
}