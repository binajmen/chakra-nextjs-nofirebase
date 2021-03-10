import * as React from 'react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { useDocument, Document } from '@nandorojo/swr-firestore'

import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Icon,
  Switch,
  Link,
  IconButton,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { FaEllipsisV, FaTrash } from 'react-icons/fa'

import EditCategory from '@/forms/EditCategory'

import { reorder } from '@/helpers/index'

import type { Category, CategoryMeta } from '@/types/category'

export default function Categories() {
  const { t } = useTranslation('common')
  const toast = useToast()
  const router = useRouter()
  const place = router.query.place

  const { data: meta, update } = useDocument<CategoryMeta>(`places/${place}/categories/_meta_`)

  function onDragEnd(result: any) {
    if (!result.destination) return
    if (result.destination.index === result.source.index) return

    const newOrder = reorder(
      meta!.order,
      result.source.index,
      result.destination.index
    )

    updateMeta(newOrder)
  }

  function updateMeta(order: string[]) {
    return update({ order })!
      .then(() => toast({
        description: t('manager:changes-saved'),
        status: "success"
      }))
      .catch((error) => toast({
        description: error.message,
        status: "error"
      }))
  }

  function deleteFromMeta(categoryId: string) {
    const newOrder = meta!.order.filter(id => id !== categoryId)
    return updateMeta(newOrder)
  }

  console.log(meta)

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
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody >
                {meta?.order.map((categoryId, index) => (
                  <CategoryRow key={categoryId}
                    categoryId={categoryId}
                    deleteFromMeta={deleteFromMeta}
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

type CategoryRowProps = {
  categoryId: string
  deleteFromMeta: (order: string) => Promise<string | number | undefined>
  index: number
}

function CategoryRow({ categoryId, deleteFromMeta, index }: CategoryRowProps) {
  const { t } = useTranslation('common')
  const modal = useDisclosure()
  const toast = useToast()
  const router = useRouter()
  const place = router.query.place

  const { data: category, update, deleteDocument } = useDocument<Category>(`places/${place}/categories/${categoryId}`)

  function updateAvailability(event: React.ChangeEvent<HTMLInputElement>) {
    update({ available: !category?.available })!
      .then(() => toast({
        description: t('manager:changes-saved'),
        status: "success"
      }))
      .catch((error) => toast({
        description: error.message,
        status: "error"
      }))
  }

  function onDelete(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    deleteFromMeta(categoryId)
      .then(() => deleteDocument())
  }

  return (
    <Draggable draggableId={categoryId} index={index}>
      {provided => (
        <Tr ref={provided.innerRef} {...provided.draggableProps} _hover={{ bgColor: 'primary.50' }}>
          <Td {...provided.dragHandleProps}><Icon as={FaEllipsisV} /></Td>
          <Td><Switch isChecked={category?.available} onChange={updateAvailability} /></Td>
          <Td>
            <Link onClick={modal.onOpen}>{category?.name}</Link>
            <EditCategory modal={modal} categoryId={categoryId} />
          </Td>
          <Td>{category?.desc}</Td>
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
