import * as React from 'react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

import type { WithID, Product } from '@/types/catalog'
import type { BasketItem } from '@/types/basket'

import {
  Box,
  Heading,
  Stack,
  Button,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  HStack,
  VStack,
} from '@chakra-ui/react'
import { FaPlus, FaMinus } from 'react-icons/fa'

import { useStoreState, useStoreActions } from '@/store/hooks'
import AlertDialog from '@/components/molecules/AlertDialog'

type ProductDrawerProps = {
  product: WithID<Product> | null
  isOpen: boolean
  onClose: () => void
}

export default function ProductDrawer({ product, isOpen, onClose }: ProductDrawerProps) {
  const { t } = useTranslation('common')
  const [quantity, setQuantity] = React.useState<number>(1)
  const alert = useDisclosure()
  const router = useRouter()
  const place = router.query.placeId as string

  const basketPlace = useStoreState(state => state.basket.place)
  const basket = useStoreActions(actions => actions.basket)

  function onMinus() {
    if (quantity > 1)
      setQuantity(quantity - 1)
  }

  function onPlus() {
    setQuantity(quantity + 1)
  }

  function dismiss() {
    setQuantity(1)
    onClose()
  }

  function isSamePlace() {
    if (basketPlace !== "" && place !== basketPlace) {
      alert.onOpen()
    } else {
      addToBasket()
    }
  }

  function addToBasket() {
    if (place !== basketPlace) {
      basket.setPlace(place)
    }

    if (product) {
      let item: BasketItem = {
        id: product.id,
        name: product.name,
        // devices: product.devices,
        // ...(product.event && { event: product.event }),
        price: product.price,
        tax: product.tax,
        quantity: quantity,
        subtotal: product.price,
        total: product.price * quantity,
        // choices: [],
        // options: [],
      }

      // Object.values(choices).forEach(choice => {
      //   Object.entries(choice).forEach(([id, choice]) => {
      //     item.choices.push({
      //       id: id,
      //       devices: choice.devices,
      //       longName: choice.longName,
      //     })
      //   })
      // })

      // Object.values(modifiers).forEach(modifier => {
      //   Object.entries(modifier).forEach(([id, option]) => {
      //     item.options.push({
      //       id: id,
      //       devices: option.devices,
      //       longName: option.longName,
      //       price: option.price,
      //       tax: option.tax,
      //     })
      //   })
      // })

      // item.total = item.total + item.options.reduce((a, c) => a + c.price, selection.price)

      basket.addItem(item)

      setQuantity(1)
      onClose()
      alert.onClose()
    }
  }

  if (!product) {
    return null
  } else {
    return (
      <Drawer placement="bottom" onClose={dismiss} isOpen={isOpen}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              {product.name}
            </DrawerHeader>

            <DrawerBody>
              <Stack spacing="24px">
                <Box>{product.description}</Box>
              </Stack>
            </DrawerBody>

            <DrawerFooter>
              <VStack w="full" spacing="6">
                <HStack spacing="3">
                  <IconButton aria-label="Search database" icon={<FaMinus />} onClick={onMinus} />
                  <Heading size="md" minW="10" textAlign="center">{quantity}</Heading>
                  <IconButton aria-label="Search database" icon={<FaPlus />} onClick={onPlus} />
                </HStack>

                <Button w="full" color="gray.900" colorScheme="primary" onClick={isSamePlace}>
                  {t('add-to-basket')}
                </Button>
              </VStack>

              <AlertDialog
                header="You can't order items from different places"
                body="If you decide to continue, your basket will be reset before adding this new item."
                isOpen={alert.isOpen}
                onCancel={alert.onClose}
                onConfirm={addToBasket}
              />

            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    )
  }
}
