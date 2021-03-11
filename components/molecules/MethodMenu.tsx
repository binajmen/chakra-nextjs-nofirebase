import * as React from 'react'
import useTranslation from 'next-translate/useTranslation'

import {
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Text,
  useBreakpointValue
} from '@chakra-ui/react'
import { FaChevronDown, FaQuestion, FaChair, FaWalking, FaBicycle } from 'react-icons/fa'
import type { IconType } from 'react-icons'

import { useStoreState, useStoreActions } from '@/store/hooks'
import { useStoreRehydrated } from 'easy-peasy'

const icons: { [index: string]: IconType } = {
  now: FaChair,
  collect: FaWalking,
  delivery: FaBicycle
}

export default function MethodMenu() {
  const { t } = useTranslation('common')
  const isMobile = useBreakpointValue({ base: true, md: false })

  const method = useStoreState(state => state.basket.method)
  const setMethod = useStoreActions(actions => actions.basket.setMethod)
  const isRehydrated = useStoreRehydrated()

  if (!isRehydrated) {
    return null
  }

  return (
    <Menu>
      <MenuButton
        as={Button}
        color="gray.900"
        colorScheme="primary"
        rightIcon={<FaChevronDown />}
      >
        {method ? (
          <>
            <Icon as={icons[method]} mr={[0, 0, 3]} />
            {!isMobile && <Text as="span">{t(method)}</Text>}
          </>
        ) : (
          <>
            <Icon as={FaQuestion} mr={[0, 0, 3]} />
            {!isMobile && <Text as="span">{t('make-your-choice')}</Text>}
          </>
        )}
      </MenuButton>
      <MenuList>
        <MenuOptionGroup defaultValue={method as string} type="radio">
          <MenuItemOption value="now" onClick={() => setMethod('now')}>
            <Icon as={FaChair} mr={3} />
            <Text as="span">{t('now')}</Text>
          </MenuItemOption>
          <MenuItemOption value="collect" onClick={() => setMethod('collect')}>
            <Icon as={FaWalking} mr={3} />
            <Text as="span">{t('collect')}</Text>
          </MenuItemOption>
          <MenuItemOption value="delivery" onClick={() => setMethod('delivery')}>
            <Icon as={FaBicycle} mr={3} />
            <Text as="span">{t('delivery')}</Text>
          </MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  )
}
