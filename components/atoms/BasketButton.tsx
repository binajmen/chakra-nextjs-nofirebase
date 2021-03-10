import * as React from 'react'

import {
  Button,
  ButtonProps,
  Icon,
  Text
} from '@chakra-ui/react'
import { FaShoppingBasket } from 'react-icons/fa'

import { useStoreState } from '@/store/hooks'

type BasketButtonProps = ButtonProps & {
  onClick: () => void
}

export default function BasketButton(props: BasketButtonProps) {
  const size = useStoreState(state => state.basket.size)

  const { onClick, ...buttonProps } = props

  return (
    <Button color="gray.900" colorScheme="primary" onClick={onClick} {...buttonProps}>
      <Icon as={FaShoppingBasket} />
      <Text>{size}</Text>
    </Button>
  )
}
