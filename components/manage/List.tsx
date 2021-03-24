import * as React from 'react'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

import {
  Box,
  Stack,
  Center,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { FaEllipsisV, FaTrash, FaEdit } from 'react-icons/fa'

import Button from '@/components/atoms/Button'
import IconButton from '@/components/atoms/IconButton'

import { reorder, objToArr } from '@/helpers/index'

type ListProps = {
  itemIds: string[]
  items: any[] | object
  price?: { [index: string]: number }
  editPrice?: (itemId: string, price: number) => void
  keys: string[]
  transform?: { [index: string]: (value: any) => any }
  onRemove: (itemId: string) => void
  onReorder: (itemIds: string[]) => void
  editPath: {
    pathname: string,
    queryId: string
  }
}

export default function List({ itemIds, items, keys, transform, onRemove, onReorder, editPath, price, editPrice }: ListProps) {
  const { t } = useTranslation('admin')
  const router = useRouter()
  const placeId = router.query.placeId

  const list = React.useMemo(() => {
    const itemsArr = Array.isArray(items) ? items : objToArr(items)
    return itemIds.map(id => itemsArr.find(i => i.id === id))
      .filter(item => item !== undefined)
  }, [itemIds, items])

  function remove(itemId: string) {
    onRemove(itemId)
  }

  function onDragEnd(result: any) {
    if (!result.destination) return
    if (result.destination.index === result.source.index) return

    const newOrder = reorder(
      itemIds,
      result.source.index,
      result.destination.index
    )

    onReorder(newOrder)
  }

  function edit(itemId: string) {
    if (window.confirm('You will lose all the changes')) {
      const { pathname, queryId } = editPath
      router.push({
        pathname,
        query: { placeId, [queryId]: itemId }
      })
    }
  }

  if (list.length) {
    return (
      <Box border="1px solid" borderColor="#E2E8F0" borderRadius="lg">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {provided => (
              <Table variant="simple" ref={provided.innerRef}>
                <Thead>
                  <Tr>
                    <Th w="1"></Th>
                    {keys.map(key => (
                      <Th key={key}>{t(key)}</Th>
                    ))}
                    {price && <Th>{t('price')}</Th>}
                    <Th w="1"></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {list.map((item, index) => (
                    <Draggable key={item!.id} draggableId={item!.id} index={index}>
                      {provided => (
                        <Tr ref={provided.innerRef} {...provided.draggableProps} _hover={{ bgColor: 'primary.50' }}>
                          <Td {...provided.dragHandleProps}><Icon as={FaEllipsisV} /></Td>
                          {keys.map(key => (
                            <Td key={key}>
                              {(transform && key in transform) ? transform[key](item[key]) : item[key]}
                            </Td>
                          ))}
                          {price &&
                            <Td>
                              {price[item!.id] / 100}€
                          </Td>
                          }
                          <Td>
                            <Stack direction="row" spacing="2">
                              <Center>
                                <Button
                                  aria-label="edit"
                                  leftIcon={<FaEdit />}
                                  size="sm"
                                  onClick={() => edit(item!.id)}
                                >
                                  {t('edit')}
                                </Button>
                              </Center>
                              <IconButton
                                aria-label="remove"
                                icon={<FaTrash />}
                                size="sm"
                                onClick={() => remove(item!.id)}
                                colorScheme="red"
                                color="tomato"
                                variant="ghost" />
                            </Stack>
                          </Td>
                        </Tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Tbody>
              </Table>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
    )
  } else {
    return (
      <Alert status="warning" colorScheme="gray" borderRadius="lg">
        <AlertIcon />
        Aucun élément sélectionné.
      </Alert>
    )
  }
}
