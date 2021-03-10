import * as React from 'react'
import useTranslation from 'next-translate/useTranslation'

import {
  Flex,
  Box,
  Text,
  Portal,
  Button,
  Icon,
  HStack,
  useDisclosure,
} from '@chakra-ui/react'
import { FaCartPlus, FaPlus, FaMinus, FaShoppingBasket } from 'react-icons/fa'

import { useStoreState } from '@/store/hooks'

import BasketDrawer from '@/components/organisms/BasketDrawer'

type BasketBarProps = {
  onClick: () => void
}

export default function BasketBar({ onClick }: BasketBarProps) {
  const { t } = useTranslation('common')

  const size = useStoreState(state => state.basket.size)
  const total = useStoreState(state => state.basket.total)

  if (size === 0) {
    return null
  } else {
    return (
      <Portal>
        <Box
          position="fixed"
          bottom="0"
          p="3"
          w="full"
        >
          <Button
            w="full"
            color="gray.900"
            colorScheme="primary"
            onClick={onClick}
          >
            <Flex justify="space-between" w="full">
              <HStack>
                <Icon as={FaShoppingBasket} />
                <Text>{size}</Text>
              </HStack>
              <Text>
                View basket
              </Text>
              <Text>{total / 100}€</Text>
            </Flex>
          </Button>
        </Box>
      </Portal>
    )
  }
}
