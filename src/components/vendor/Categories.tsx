import * as React from 'react'
import produce from 'immer'
import useTranslation from 'next-translate/useTranslation'

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

import type { Categories as CatType } from '../../types/category'

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

type CategoriesProps = {
    meta: string[]
    categories: CatType
}

export default function Categories({ meta, categories }: CategoriesProps) {
    const { t } = useTranslation('common')

    return (
        <Box py={6}>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th></Th>
                        <Th>Available</Th>
                        <Th>Name</Th>
                        <Th>Description</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {meta.map((catId, index) =>
                        <Tr key={index}>
                            <Td><Icon as={FaEllipsisV} /></Td>
                            <Td><Switch isChecked={categories[catId].available} /></Td>
                            <Td>{categories[catId].name}</Td>
                            <Td>{categories[catId].desc}</Td>
                        </Tr>
                    )}
                </Tbody>
            </Table>
        </Box>
    )
}
