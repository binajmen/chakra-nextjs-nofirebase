import * as React from "react"
import useTranslation from 'next-translate/useTranslation'

import { Box, InputGroup, Input, InputLeftElement } from '@chakra-ui/react'
import { FaLocationArrow } from "react-icons/fa"

export default function SearchInput() {
    const { t } = useTranslation('common')

    return (
        <Box p={3}>
            <InputGroup boxShadow="xs" borderColor="primary.600">
                <InputLeftElement
                    color="primary.600"
                    pointerEvents="none"
                    children={<FaLocationArrow />}
                />
                <Input type="search" placeholder={t('your-address')} bg="white" />
            </InputGroup>
        </Box>
    )
}