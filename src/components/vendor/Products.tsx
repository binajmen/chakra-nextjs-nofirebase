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

import EditProduct from '../../forms/EditProduct'

import { useStoreState, useStoreActions } from '../../store/hooks'

type ProductsProps = {
    categoryId: string
}

export default function Products({ categoryId }: ProductsProps) {
    const { t } = useTranslation('common')

    const order = useStoreState(state => state.categories.list[categoryId]?.items ?? [])

    function onDragEnd(result: any) {
        // if (!result.destination) return
        // if (result.destination.index === result.source.index) return

        // const newOrder = reorder(
        //     order,
        //     result.source.index,
        //     result.destination.index
        // )

        // updateOrder({ vendorId, newOrder })
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
                                    <Th>{t('vendor:price')}</Th>
                                    <Th></Th>
                                </Tr>
                            </Thead>
                            <Tbody >
                                {order.map((productId, index) => (
                                    <ProductRow key={productId}
                                        categoryId={categoryId}
                                        productId={productId}
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
    index: number
}

function ProductRow({ categoryId, productId, index }: ProductRowProps) {
    const { t } = useTranslation()
    const toast = useToast()
    const modal = useDisclosure()
    const router = useRouter()
    const vendorId = router.query.vendorId as string

    const products = useStoreState(state => state.products.list)
    const actions = useStoreActions(actions => actions.products)

    function updateAvailability(event: React.ChangeEvent<HTMLInputElement>) {
        actions.updateAvailability({ vendorId, productId, available: !products[productId].available })
    }

    function onDelete(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        actions.deleteProduct({ vendorId, productId })
    }

    return (
        <Draggable draggableId={productId} index={index}>
            {provided => (
                <Tr ref={provided.innerRef} {...provided.draggableProps} _hover={{ bgColor: 'primary.50' }}>
                    <Td {...provided.dragHandleProps}><Icon as={FaEllipsisV} /></Td>
                    <Td><Switch isChecked={products[productId]?.available} onChange={updateAvailability} /></Td>
                    <Td>
                        <Link onClick={modal.onOpen}>{products[productId]?.name}</Link>
                        <EditProduct modal={modal} productId={productId} />
                    </Td>
                    <Td>{products[productId]?.desc}</Td>
                    <Td>{products[productId]?.price / 100}€</Td>
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
