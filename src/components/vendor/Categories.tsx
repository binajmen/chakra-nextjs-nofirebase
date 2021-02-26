import * as React from 'react'
import produce from 'immer'
import useTranslation from 'next-translate/useTranslation'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

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
    Switch
} from '@chakra-ui/react'
import { FaEllipsisV, FaArrowsAlt, FaArrowsAltV } from 'react-icons/fa'

import type {
    Categories as CategoriesType,
    Category
} from '../../types/category'

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

type CategoriesProps = {
    meta: string[]
    categories: CategoriesType
}

function reorder(list: string[], startIndex: number, endIndex: number) {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    console.log(list, startIndex, endIndex)
    console.log(result)
    return result
}

export default function Categories(props: CategoriesProps) {
    const { t } = useTranslation('common')

    const [meta, setMeta] = React.useState<string[]>(props.meta)

    React.useEffect(() => { setMeta(props.meta) }, [props.meta])

    function onDragEnd(result: any) {
        if (!result.destination) {
            return;
        }

        if (result.destination.index === result.source.index) {
            return;
        }

        const newOrder = reorder(
            meta,
            result.source.index,
            result.destination.index
        )

        setMeta(newOrder)
    }

    return (
        <Box py={6}>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {provided => (
                        <Table variant="simple" ref={provided.innerRef}>
                            <Thead>
                                <Tr>
                                    <Th></Th>
                                    <Th>Available</Th>
                                    <Th>Name</Th>
                                    <Th>Description</Th>
                                </Tr>
                            </Thead>
                            <Tbody >
                                {meta.map((catId, index) => (
                                    <Row key={catId} id={catId} index={index} category={props.categories[catId]} />
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

type RowProps = {
    id: string
    index: number
    category: Category
}

function Row({ id, index, category }: RowProps) {
    return (
        <Draggable draggableId={id} index={index}>
            {provided => (
                <Tr ref={provided.innerRef} {...provided.draggableProps}>
                    <Td {...provided.dragHandleProps}><Icon as={FaEllipsisV} /></Td>
                    <Td><Switch isChecked={category.available} /></Td>
                    <Td>{category.name}</Td>
                    <Td>{category.desc}</Td>
                </Tr>
            )}
        </Draggable>
    )
}
