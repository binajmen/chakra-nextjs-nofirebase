import * as React from 'react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

import type { BasketItem as BasketItemType } from '@/types/order'

import {
  Box,
  Heading,
  Stack,
  Button,
  IconButton,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  HStack,
  VStack,
  Flex,
  Text,
  Icon,
  LinkBox,
  LinkOverlay,
  Image
} from '@chakra-ui/react'
import { FaPlus, FaMinus, FaShoppingBasket } from 'react-icons/fa'
import { FaChevronDown, FaChevronUp, FaTrash } from 'react-icons/fa'

import { useStoreState, useStoreActions } from '@/store/hooks'

import Drawer from '@/components/molecules/Drawer'
import Method from '@/components/atoms/Method'
import NextButton from '@/components/atoms/NextButton'

type BasketDrawerProps = {
  logo: string
  isOpen: boolean
  onClose: () => void
}

export default function BasketDrawer({ logo, isOpen, onClose }: BasketDrawerProps) {
  const { t } = useTranslation('common')

  const method = useStoreState(state => state.basket.method)
  const items = useStoreState(state => state.basket.items)
  const size = useStoreState(state => state.basket.size)
  const total = useStoreState(state => state.basket.total)

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      // size="full"
      header={
        <Heading size="lg">{t('your-basket')}</Heading>
      }
      footer={
        <NextButton
          w="full"
          pathname={`/checkout/${method}`}
        >
          <Flex justify="space-between" w="full">
            <HStack>
              <Icon as={FaShoppingBasket} />
              <Text>{size}</Text>
            </HStack>
            <Text>
              {t('checkout')}
            </Text>
            <Text>{total / 100}€</Text>
          </Flex>
        </NextButton >
      }
    >
      <Image m="auto" boxSize="100px" objectFit="contain" src={logo} alt="Myresto.brussels" />
      <Method method={method as string} />
      <Box>
        {items.map((item, index) => <BasketItem key={index} index={index} item={item} />)}
      </Box>
    </Drawer >
  )
}

type BasketItemProps = {
  item: BasketItemType
  index: number
}

// FaChevronDown, FaChevronUp, FaCaretDown, FaCaretUp
function BasketItem({ item, index }: BasketItemProps) {
  const { t } = useTranslation('common')
  const modify = useDisclosure()

  const actions = useStoreActions(actions => actions.basket)

  function onMinus() {
    actions.decreaseItem(index)
  }

  function onPlus() {
    actions.increaseItem(index)
  }

  function onDelete() {
    actions.deleteItem(index)
    modify.onClose()
  }

  return (
    <VStack w="full">
      <LinkBox w="full">
        <Flex w="full" alignItems="center" py="2">
          <Icon as={modify.isOpen ? FaChevronUp : FaChevronDown} mr="2" />
          <LinkOverlay w="full" onClick={modify.onToggle}>
            <Text w="full">{item.quantity} x {item.name}</Text>
          </LinkOverlay>
          <Text size="md">{item.total / 100}€</Text>
        </Flex>
        {item.options.length > 0 &&
          <Stack direction="column" fontSize="sm" spacing="0" pl="8">
            {item.options.map((option, index) =>
              <Text key={index}>{option.name}</Text>
            )}
          </Stack>
        }
      </LinkBox>
      {modify.isOpen &&
        <Flex w="full" justify="space-between" pb="2">
          <Button size="sm" leftIcon={<FaTrash />} colorScheme="red" variant="ghost" onClick={onDelete}>{t('delete')}</Button>
          <HStack spacing="3">
            <IconButton aria-label="minus" size="sm" icon={<FaMinus />} onClick={onMinus} />
            <Heading size="sm" minW="5" textAlign="center">{item.quantity}</Heading>
            <IconButton aria-label="plus" size="sm" icon={<FaPlus />} onClick={onPlus} />
          </HStack>
        </Flex>
      }
    </VStack>
  )
}
