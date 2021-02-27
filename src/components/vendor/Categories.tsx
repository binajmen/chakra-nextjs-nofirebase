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
    IconButton,
    useToast,
    useDisclosure
} from '@chakra-ui/react'
import { FaEllipsisV, FaTrash, FaArrowsAltV } from 'react-icons/fa'

import { updateCategoryOrder, updateCategoryAvailability, deleteCategory } from '../../firebase/helpers/vendors'
import EditCategory from '../../forms/EditCategory'

import type {
    Categories as CategoriesType,
    Category
} from '../../types/category'

type CategoriesProps = {
    order: string[]
    setOrder: React.Dispatch<React.SetStateAction<string[]>>
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
                                    <Th></Th>
                                </Tr>
                            </Thead>
                            <Tbody >
                                {order.map((catId, index) => (
                                    <CategoryRow key={catId}
                                        catId={catId}
                                        index={index}
                                        order={props.order}
                                        setOrder={props.setOrder}
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
    order: string[]
    setOrder: React.Dispatch<React.SetStateAction<string[]>>
    categories: CategoriesType
    setCategories: React.Dispatch<React.SetStateAction<CategoriesType>>
}

function CategoryRow({ catId, index, order, setOrder, categories, setCategories }: CategoryRowProps) {
    const { t } = useTranslation()
    const toast = useToast()
    const modal = useDisclosure()
    const router = useRouter()

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

    function onDelete(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        const newOrder = order.filter(item => item !== catId)
        let promises: Promise<void>[] = [
            deleteCategory(vendorId, catId),
            updateCategoryOrder(vendorId, newOrder)
        ]
        Promise.all(promises)
            .then(() => {
                setOrder(draft => newOrder)
                setCategories(produce(draft => { delete draft[catId] }))
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
                <Tr ref={provided.innerRef} {...provided.draggableProps} _hover={{ bgColor: 'primary.50' }}>
                    <Td {...provided.dragHandleProps}><Icon as={FaEllipsisV} /></Td>
                    <Td><Switch isChecked={categories[catId].available} onChange={updateAvailability} /></Td>
                    <Td>
                        <Link onClick={modal.onOpen}>{categories[catId].name}</Link>
                        <EditCategory modal={modal} category={categories[catId]} setCategories={setCategories} />
                    </Td>
                    <Td>{categories[catId].desc}</Td>
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
