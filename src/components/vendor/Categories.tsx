import * as React from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
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
    Switch,
    Link,
    useToast
} from '@chakra-ui/react'
import { FaEllipsisV, FaArrowsAlt, FaArrowsAltV } from 'react-icons/fa'

import { updateCategoryOrder, updateCategoryAvailability } from '../../firebase/helpers/vendors'

import type {
    Categories as CategoriesType,
    Category
} from '../../types/category'

type CategoriesProps = {
    order: string[]
    categories: CategoriesType
    setCategories: React.Dispatch<React.SetStateAction<CategoriesType>>
}

function reorder(list: string[], startIndex: number, endIndex: number) {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
}

export default function Categories(props: CategoriesProps) {
    const { t } = useTranslation('common')
    const toast = useToast()
    const router = useRouter()
    const { vendorId } = router.query

    const [order, setOrder] = React.useState<string[]>(props.order)

    React.useEffect(() => { setOrder(props.order) }, [props.order])

    function onDragEnd(result: any) {
        if (!result.destination) return
        if (result.destination.index === result.source.index) return

        const newOrder = reorder(
            order,
            result.source.index,
            result.destination.index
        )

        updateCategoryOrder(vendorId as string, newOrder)
            .then(() => {
                setOrder(newOrder)
                toast({
                    description: t('vendor:changes-saved'),
                    status: "success"
                })
            })
            .catch((error) => {
                console.error(error)
                toast({
                    description: error,
                    status: "error"
                })
            })
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
                                </Tr>
                            </Thead>
                            <Tbody >
                                {order.map((catId, index) => (
                                    <CategoryRow key={catId}
                                        catId={catId}
                                        index={index}
                                        categories={props.categories}
                                        setCategories={props.setCategories}
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
    catId: string
    index: number
    categories: CategoriesType
    setCategories: React.Dispatch<React.SetStateAction<CategoriesType>>
}

function CategoryRow({ catId, index, categories, setCategories }: CategoryRowProps) {
    const { t } = useTranslation()
    const router = useRouter()
    const toast = useToast()
    const vendorId = router.query.vendorId as string

    function updateAvailability(event: React.ChangeEvent<HTMLInputElement>) {
        updateCategoryAvailability(vendorId, catId, !categories[catId].available)
            .then(() => {
                setCategories(produce(draft => { draft[catId].available = !categories[catId].available }))
                toast({
                    description: t('vendor:changes-saved'),
                    status: "success"
                })
            })
            .catch((error) => {
                console.error(error)
                toast({
                    description: error,
                    status: "error"
                })
            })
    }

    return (
        <Draggable draggableId={catId} index={index}>
            {provided => (
                <Tr ref={provided.innerRef} {...provided.draggableProps}>
                    <Td {...provided.dragHandleProps}><Icon as={FaEllipsisV} /></Td>
                    <Td><Switch isChecked={categories[catId].available} onChange={updateAvailability} /></Td>
                    <Td>
                        <NextLink href={{
                            pathname: '/vendor/[vendorId]/categories/[catId]',
                            query: { vendorId, catId }
                        }}>
                            <Link>{categories[catId].name}</Link>
                        </NextLink>
                    </Td>
                    <Td>{categories[catId].desc}</Td>
                </Tr>
            )}
        </Draggable>
    )
}
