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
import AlertDialog from './AlertDialog'

const icons: { [index: string]: IconType } = {
  now: FaChair,
  collect: FaWalking,
  delivery: FaBicycle
}

export default function MethodMenu() {
  const { t } = useTranslation('common')
  const isMobile = useBreakpointValue({ base: true, md: false })
  const [newMethod, setNewMethod] = React.useState<string>("")

  const method = useStoreState(state => state.basket.method)
  const setMethod = useStoreActions(actions => actions.basket.setMethod)
  const isRehydrated = useStoreRehydrated()

  function _setMethod(method: string) {
    const isDone = setMethod({ method })
    if (!isDone) {
      setNewMethod(method)
    }
  }

  function confirmMethod() {
    setMethod({ method: newMethod, isConfirmed: true })
    setNewMethod("")
  }

  if (!isRehydrated) {
    return null
  }

  return (
    <>
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
          <MenuOptionGroup value={method as string} type="radio">
            {/* <MenuItemOption value="now" onClick={() => _setMethod('now')}>
              <Icon as={FaChair} mr={3} />
              <Text as="span">{t('now')}</Text>
            </MenuItemOption> */}
            <MenuItemOption value="collect" onClick={() => _setMethod('collect')}>
              <Icon as={FaWalking} mr={3} />
              <Text as="span">{t('collect')}</Text>
            </MenuItemOption>
            <MenuItemOption value="delivery" onClick={() => _setMethod('delivery')}>
              <Icon as={FaBicycle} mr={3} />
              <Text as="span">{t('delivery')}</Text>
            </MenuItemOption>
          </MenuOptionGroup>
        </MenuList>
      </Menu>

      <AlertDialog
        header="Produits incompatibles avec le type de commande"
        body="Certains produits dans votre panier ne sont pas compatibles avec le type de commande que vous venez de sélectionner. En confirmant votre choix, ces produits seront retirés de votre panier."
        isOpen={newMethod !== ""}
        onCancel={() => setNewMethod("")}
        onConfirm={confirmMethod}
      />
    </>
  )
}
