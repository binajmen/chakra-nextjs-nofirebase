import * as React from 'react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

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
    useDisclosure
} from '@chakra-ui/react'
import { FaEllipsisV, FaTrash } from 'react-icons/fa'

import EditCategory from '../../forms/EditCategory'

import { useStoreState, useStoreActions } from '../../store/hooks'

function reorder(list: string[], startIndex: number, endIndex: number) {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
}

export default function Categories() {
    const { t } = useTranslation('common')
    const router = useRouter()
    const vendorId = router.query.vendorId as string

    const order = useStoreState(state => state.categories.order)
    const updateOrder = useStoreActions(actions => actions.categories.updateOrder)

    function onDragEnd(result: any) {
        if (!result.destination) return
        if (result.destination.index === result.source.index) return

        const newOrder = reorder(
            order,
            result.source.index,
            result.destination.index
        )

        updateOrder({ vendorId, newOrder })
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
                                    <Th>{t('vendor:available')}</Th>
                                    <Th>{t('vendor:name')}</Th>
                                    <Th>{t('vendor:description')}</Th>
                                    <Th></Th>
                                </Tr>
                            </Thead>
                            <Tbody >
                                {order.map((categoryId, index) => (
                                    <CategoryRow key={categoryId}
                                        categoryId={categoryId}
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
    index: number
}

function CategoryRow({ categoryId, index }: CategoryRowProps) {
    const modal = useDisclosure()
    const router = useRouter()
    const vendorId = router.query.vendorId as string

    const categories = useStoreState(state => state.categories.list)
    const actions = useStoreActions(actions => actions.categories)

    function updateAvailability(event: React.ChangeEvent<HTMLInputElement>) {
        actions.updateAvailability({
            vendorId,
            categoryId,
            available: !categories[categoryId].available
        })
    }

    function onDelete(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        actions.deleteCategory({ vendorId, categoryId })
    }

    return (
        <Draggable draggableId={categoryId} index={index}>
            {provided => (
                <Tr ref={provided.innerRef} {...provided.draggableProps} _hover={{ bgColor: 'primary.50' }}>
                    <Td {...provided.dragHandleProps}><Icon as={FaEllipsisV} /></Td>
                    <Td><Switch isChecked={categories[categoryId].available} onChange={updateAvailability} /></Td>
                    <Td>
                        <Link onClick={modal.onOpen}>{categories[categoryId].name}</Link>
                        <EditCategory modal={modal} categoryId={categoryId} />
                    </Td>
                    <Td>{categories[categoryId].desc}</Td>
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
