import * as React from 'react'
import { useRouter } from 'next/router'
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
  const router = useRouter()
  const placeId = router.query.placeId
  const isMobile = useBreakpointValue({ base: true, md: false })
  const [newMethod, setNewMethod] = React.useState<string>("")

  const method = useStoreState(state => state.basket.method)
  const setMethod = useStoreActions(actions => actions.basket.setMethod)
  const isRehydrated = useStoreRehydrated()

  function onMethod(newMethod: string) {
    if (method !== newMethod) {
      setNewMethod(newMethod)
    }
  }

  function confirmMethod() {
    if (placeId) {
      router.push({
        pathname: "/place/[placeId]/[catalogId]",
        query: { placeId, catalogId: newMethod }
      })
      setNewMethod("")
    } else {
      setMethod(newMethod)
      setNewMethod("")
    }
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
            <MenuItemOption value="collect" onClick={() => onMethod('collect')}>
              <Icon as={FaWalking} mr={3} />
              <Text as="span">{t('collect')}</Text>
            </MenuItemOption>
            <MenuItemOption value="delivery" onClick={() => onMethod('delivery')}>
              <Icon as={FaBicycle} mr={3} />
              <Text as="span">{t('delivery')}</Text>
            </MenuItemOption>
          </MenuOptionGroup>
        </MenuList>
      </Menu>

      <AlertDialog
        header="Votre panier va être vidé !"
        body="En changeant le mode de commande, vous allez être redirigé vers le menu adéquat."
        isOpen={newMethod !== ""}
        onCancel={() => setNewMethod("")}
        onConfirm={confirmMethod}
      />
    </>
  )
}
