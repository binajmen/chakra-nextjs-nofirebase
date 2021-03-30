import * as React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

import {
  Flex,
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
  Icon,
  Text
} from '@chakra-ui/react'
import { FaPlus, FaMinus, FaRegSquare, FaCheckSquare, FaRegCircle, FaCheckCircle } from 'react-icons/fa'

import { useStoreState, useStoreActions } from '@/store/hooks'
import AlertDialog from '@/components/molecules/AlertDialog'

import type { WithID, Modifiers as ModifiersType, Modifier as ModifierType, Product } from '@/types/catalog'
import type { BasketItem } from '@/types/basket'

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
  const [innerHeight, setH] = React.useState<number>(typeof window !== "undefined" ? window.innerHeight : 100)

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

  function windowResizeHandler() {
    if (window !== undefined) {
      setH(window.innerHeight)
    }
  }

  React.useEffect(() => {
    if (window !== undefined) {
      window.addEventListener('resize', windowResizeHandler)
      return () => {
        window.removeEventListener('resize', windowResizeHandler)
      }
    }
  }, [])

  if (!product) {
    return null
  } else {
    return (
      <Drawer placement="bottom" onClose={dismiss} isOpen={isOpen} scrollBehavior="outside">
        <DrawerOverlay>
          <DrawerContent maxH={innerHeight}>
            {product.imageUrl &&
              <Box position="relative" h="200px" maxH="25vh" w="full">
                <Image src={product.imageUrl} alt={product.description} layout="fill" objectFit="cover" />
              </Box>
            }

            <DrawerCloseButton bgColor={product.imageUrl ? "white" : ""} />

            <DrawerHeader>
              {product.name}
            </DrawerHeader>

            <DrawerBody>
              <Stack spacing="6">
                <Box>{product.description}</Box>
                <Modifiers modifiers={product.modifiers} />
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

type ModifiersProps = {
  modifiers: ModifiersType
}

function Modifiers({ modifiers }: ModifiersProps) {
  if ("order" in modifiers) {
    return (
      <React.Fragment>
        {modifiers.order.map(id =>
          <Modifier key={id} modifier={modifiers.modifier[id]} />
        )}
      </React.Fragment>
    )
  } else {
    return null
  }
}

type ModifierProps = {
  modifier: ModifierType
}

function Modifier({ modifier }: ModifierProps) {
  const isMultiple = modifier.min < modifier.max

  return (
    <Box>
      <Heading size="md" borderBottom="1px solid lightgray" mb="3">{modifier.name}</Heading>
      <Stack direction="column">
        {modifier.products.order.map(id =>
          <Option key={id}
            product={modifier.products.product[id]}
            price={modifier.products.price[id]}
            isSelected={true}
            isMultiple={modifier.max === 3}
          />
        )}
      </Stack>
    </Box>
  )
}

type OptionProps = {
  product: Product
  price: number
  isSelected: boolean
  isMultiple: boolean
}

function Option({ product, price, isSelected, isMultiple }: OptionProps) {
  const icon = isSelected ? (isMultiple ? FaCheckCircle : FaCheckSquare) : (isMultiple ? FaRegCircle : FaRegSquare)

  return (
    <Flex justify="space-between" py="1" onClick={() => { }}>
      <Flex alignItems="center">
        <Icon as={icon} boxSize="6" color={isSelected ? "green.300" : "lightgray"} mr="3" />
        <Text>{product.name}</Text>
      </Flex>
      <Text>{price / 100}€</Text>
    </Flex>
  )
}
