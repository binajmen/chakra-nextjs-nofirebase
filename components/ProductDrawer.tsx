import * as React from 'react'
import Image from 'next/image'
import produce from 'immer'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'

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
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  HStack,
  VStack,
  Icon,
  Text,
  Center
} from '@chakra-ui/react'
import { FaPlus, FaMinus, FaRegSquare, FaCheckSquare, FaRegCircle, FaCheckCircle } from 'react-icons/fa'

import { useStoreState, useStoreActions } from '@/store/hooks'
import AlertDialog from '@/components/molecules/AlertDialog'
import useWindowSize from '@/hooks/useWindowSize'

import type { WithID, Modifiers as ModifiersType, Modifier as ModifierType, Product, Products } from '@/types/catalog'
import type { BasketItem } from '@/types/order'

type ProductDrawerProps = {
  product: WithID<Product> | null
  isOpen: boolean
  onClose: () => void
}

type Options = {
  [index: string]: { [index: string]: Product }
}

export default function ProductDrawer({ product, isOpen, onClose }: ProductDrawerProps) {
  const { t } = useTranslation('common')
  const alert = useDisclosure()
  const router = useRouter()
  const placeId = router.query.placeId as string
  const { height } = useWindowSize()
  const [quantity, setQuantity] = React.useState<number>(1)
  const [modifiers, setModifiers] = React.useState<Options>({})
  const [comment, setComment] = React.useState<string>("")

  const basketPlaceId = useStoreState(state => state.basket.placeId)
  const basket = useStoreActions(actions => actions.basket)

  function updateModifiers(id: string, options: Products) {
    console.log(id, options)
    setModifiers(produce(draft => {
      draft[id] = options
    }))
    // setModifiers((prev) => ({ ...prev, [id]: options }))
  }

  React.useEffect(() => console.log(modifiers), [modifiers])

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
    if (basketPlaceId !== "" && placeId !== basketPlaceId) {
      alert.onOpen()
    } else {
      addToBasket()
    }
  }

  function addToBasket() {
    if (placeId !== basketPlaceId) {
      basket.setPlaceId(placeId)
    }

    if (product) {
      let item: BasketItem = {
        id: product.id,
        name: product.name,
        // ...(product.event && { event: product.event }),
        price: product.price,
        tax: product.tax,
        options: [],
        subtotal: product.price,
        quantity: quantity,
        total: product.price * quantity,
        comment: comment
      }

      Object.values(modifiers).forEach(modifier => {
        Object.entries(modifier).forEach(([id, option]) => {
          item.options.push({
            id: id,
            name: option.name,
            price: option.price,
            tax: option.tax,
          })
        })
      })

      item.subtotal = item.options.reduce((a, c) => a + c.price, product.price)
      item.total = item.subtotal * quantity

      basket.addItem(item)

      setQuantity(1)
      setModifiers({})
      onClose()
      alert.onClose()
    }
  }

  if (!product) {
    return null
  } else {
    return (
      <Drawer placement="bottom" onClose={dismiss} isOpen={isOpen} scrollBehavior="outside">
        <DrawerOverlay>
          <DrawerContent maxH={height}>
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
                <Modifiers
                  modifiers={product.modifiers}
                  updateModifiers={updateModifiers}
                />
                <FormControl>
                  <FormLabel htmlFor="comment">{t('comment')}</FormLabel>
                  <Input
                    name="comment"
                    id="comment"
                    onChange={(event) => setComment(event.target.value)}
                    placeholder={t('optional')}
                  />
                </FormControl>
              </Stack>
            </DrawerBody>

            <DrawerFooter boxShadow="inner">
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
  updateModifiers: (id: string, options: Products) => void
}

function Modifiers({ modifiers, updateModifiers }: ModifiersProps) {
  if ("order" in modifiers) {
    return (
      <React.Fragment>
        {modifiers.order.map(id =>
          <Modifier key={id}
            id={id}
            modifier={modifiers.modifier[id]}
            updateModifiers={updateModifiers}
          />
        )}
      </React.Fragment>
    )
  } else {
    return null
  }
}

type ModifierProps = {
  id: string
  modifier: ModifierType
  updateModifiers: (id: string, options: Products) => void
}

function Modifier({ id, modifier, updateModifiers }: ModifierProps) {
  const [options, setOptions] = React.useState<Products>({})

  const isRequired = modifier.min > 0
  const hasSingleChoice = modifier.max === 1
  const hasLimit = modifier.max < modifier.products.order.length + 1
  const showMin = isRequired
  const showMax = hasLimit && !hasSingleChoice

  function onClick(id: string, option: Product) {
    if (options[id]) {
      if (Object.keys(options).length > modifier.min)
        setOptions(produce(draft => {
          delete draft[id]
        }))
    } else if (modifier.max === 1) {
      setOptions({
        [id]: {
          ...option,
          price: modifier.products.price[id]
        }
      })
    } else if (Object.keys(options).length < modifier.max) {
      setOptions({
        ...options,
        [id]: {
          ...option,
          price: modifier.products.price[id]
        }
      })
    }
  }

  React.useEffect(() => {
    for (let i = 0; i < modifier.min; i++) {
      setOptions({
        ...options,
        [modifier.products.order[0]]: {
          ...modifier.products.product[modifier.products.order[0]],
          price: modifier.products.price[modifier.products.order[0]]
        }
      })
    }
  }, [modifier])

  React.useEffect(() => {
    updateModifiers(id, options)
  }, [options])

  return (
    <Box>
      <Flex justify="space-between" borderBottom="1px solid lightgray" mb="3">
        <Heading size="md">{modifier.name}</Heading>
        {(showMin || showMax) &&
          <Center>
            <Stack direction="row" fontSize="xs" spacing="1">
              {showMin && <Text>Min: {modifier.min}</Text>}
              {showMin && showMax && <Text>–</Text>}
              {showMax && <Text>Max: {modifier.max}</Text>}
            </Stack>
          </Center>
        }
      </Flex>
      <Stack direction="column">
        {modifier.products.order.map(id =>
          <Option key={id}
            product={modifier.products.product[id]}
            price={modifier.products.price[id]}
            hasSingleChoice={hasSingleChoice}
            isSelected={id in options}
            onClick={() => onClick(id, modifier.products.product[id])}
          />
        )}
      </Stack>
    </Box>
  )
}

type OptionProps = {
  product: Product
  price: number
  hasSingleChoice: boolean
  isSelected: boolean
  onClick: () => void
}

function Option({ product, price, hasSingleChoice, isSelected, onClick }: OptionProps) {
  const { t } = useTranslation("common")
  const icon = isSelected ? (hasSingleChoice ? FaCheckCircle : FaCheckSquare) : (hasSingleChoice ? FaRegCircle : FaRegSquare)

  return (
    <Flex justify="space-between" py="1" onClick={onClick}>
      <Flex alignItems="center">
        <Icon as={icon} boxSize="6" color={isSelected ? "green.300" : "lightgray"} mr="3" />
        <Text>{product.name}</Text>
      </Flex>
      <Text>{price === 0 ? t("free") : `${price / 100}€`}</Text>
    </Flex>
  )
}
