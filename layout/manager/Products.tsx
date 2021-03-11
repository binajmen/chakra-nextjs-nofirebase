import * as React from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import produce from 'immer'
import useTranslation from 'next-translate/useTranslation'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { useDocument, useCollection } from '@nandorojo/swr-firestore'

import {
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Icon,
  Switch,
  Link,
  IconButton,
  useToast,
  useDisclosure
} from '@chakra-ui/react'
import { FaEllipsisV, FaTrash, FaArrowsAltV } from 'react-icons/fa'

import EditProduct from '@/forms/EditProduct'

import { useStoreState, useStoreActions } from '@/store/hooks'

import { reorder } from '@/helpers/index'

import type { Category } from '@/types/category'
import type { Product, Products as ProductsType } from '@/types/product'

export default function Products() {
  const { t } = useTranslation('common')
  const toast = useToast()
  const router = useRouter()
  const placeId = router.query.place
  const categoryId = router.query.category as string

  const { data: category, update } = useDocument<Category>(`places/${placeId}/categories/${categoryId}`)

  function onDragEnd(result: any) {
    if (!result.destination) return
    if (result.destination.index === result.source.index) return

    const newOrder = reorder(
      category!.items,
      result.source.index,
      result.destination.index
    )

    update({ items: newOrder })!
      .then(() => toast({
        description: t('manager:changes-saved'),
        status: "success"
      }))
      .catch((error) => toast({
        description: error.message,
        status: "error"
      }))
  }

  function deleteFromCategory(id: string) {
    return update({ items: category!.items.filter(i => i !== id) })
  }

  return (
    <Box>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {provided => (
            <Table variant="simple" ref={provided.innerRef}>
              <Thead>
                <Tr>
                  <Th></Th>
                  <Th>{t('manager:available')}</Th>
                  <Th>{t('manager:name')}</Th>
                  <Th>{t('manager:description')}</Th>
                  <Th>{t('manager:price')}</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {category?.items.map((productId, index) => (
                  <ProductRow key={productId}
                    categoryId={categoryId}
                    productId={productId}
                    deleteFromCategory={deleteFromCategory}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </Tbody>
            </Table>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  )
}

type ProductRowProps = {
  categoryId: string
  productId: string
  deleteFromCategory: (id: string) => Promise<void> | null
  index: number
}

function ProductRow({ categoryId, productId, deleteFromCategory, index }: ProductRowProps) {
  const { t } = useTranslation()
  const toast = useToast()
  const modal = useDisclosure()
  const router = useRouter()
  const placeId = router.query.place as string

  const { data: product, update, deleteDocument } = useDocument<Product>(`places/${placeId}/products/${productId}`)

  function updateAvailability(event: React.ChangeEvent<HTMLInputElement>) {
    update({ available: !product!.available })!
      .then(() => toast({
        description: t('manager:changes-saved'),
        status: "success"
      }))
  }

  function onDelete(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    deleteFromCategory(productId)!
      .then(() => deleteDocument())
  }

  if (!product || !product.exists) return null

  return (
    <Draggable draggableId={productId} index={index}>
      {provided => (
        <Tr ref={provided.innerRef} {...provided.draggableProps} _hover={{ bgColor: 'primary.50' }}>
          <Td {...provided.dragHandleProps}><Icon as={FaEllipsisV} /></Td>
          <Td><Switch isChecked={product.available} onChange={updateAvailability} /></Td>
          <Td>
            <Link onClick={modal.onOpen}>{product.name}</Link>
            <EditProduct modal={modal} productId={productId} />
          </Td>
          <Td>{product.desc}</Td>
          <Td>{product.price / 100}€</Td>
          <Td>
            <IconButton aria-label="delete"
              colorScheme="gray"
              variant="ghost"
              icon={<FaTrash />}
              onClick={onDelete}
            />
          </Td>
        </Tr>
      )}
    </Draggable>
  )
}
