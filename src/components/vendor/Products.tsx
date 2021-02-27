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

import { updateProductAvailability, deleteProduct } from '../../firebase/helpers/products'
import EditProduct from '../../forms/EditProduct'

import type {
    Products as ProductsType,
    Product
} from '../../types/product'

type ProductsProps = {
    order: string[]
    setOrder: React.Dispatch<React.SetStateAction<string[]>>
    products: ProductsType
    setProducts: React.Dispatch<React.SetStateAction<ProductsType>>
}

function reorder(list: string[], startIndex: number, endIndex: number) {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
}

export default function Products(props: ProductsProps) {
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

        // updateProductOrder(vendorId as string, newOrder)
        //     .then(() => {
        //         setOrder(newOrder)
        //         toast({
        //             description: t('vendor:changes-saved'),
        //             status: "success"
        //         })
        //     })
        //     .catch((error) => {
        //         console.error(error)
        //         toast({
        //             description: error,
        //             status: "error"
        //         })
        //     })
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
                                    <ProductRow key={catId}
                                        catId={catId}
                                        index={index}
                                        order={props.order}
                                        setOrder={props.setOrder}
                                        products={props.products}
                                        setProducts={props.setProducts}
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
    catId: string
    index: number
    order: string[]
    setOrder: React.Dispatch<React.SetStateAction<string[]>>
    products: ProductsType
    setProducts: React.Dispatch<React.SetStateAction<ProductsType>>
}

function ProductRow({ catId, index, order, setOrder, products, setProducts }: ProductRowProps) {
    const { t } = useTranslation()
    const toast = useToast()
    const modal = useDisclosure()
    const router = useRouter()

    const vendorId = router.query.vendorId as string

    function updateAvailability(event: React.ChangeEvent<HTMLInputElement>) {
        updateProductAvailability(vendorId, catId, !products[catId].available)
            .then(() => {
                setProducts(produce(draft => { draft[catId].available = !products[catId].available }))
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
            deleteProduct(vendorId, catId),
            // updateProductOrder(vendorId, newOrder)
        ]
        Promise.all(promises)
            .then(() => {
                setOrder(draft => newOrder)
                setProducts(produce(draft => { delete draft[catId] }))
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
                    <Td><Switch isChecked={products[catId].available} onChange={updateAvailability} /></Td>
                    <Td>
                        <Link onClick={modal.onOpen}>{products[catId].name}</Link>
                        <EditProduct modal={modal} product={products[catId]} setProducts={setProducts} />
                    </Td>
                    <Td>{products[catId].desc}</Td>
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
