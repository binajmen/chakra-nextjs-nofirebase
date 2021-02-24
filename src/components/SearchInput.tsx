import * as React from "react"
import useTranslation from 'next-translate/useTranslation'

import { Box, InputGroup, Input, InputLeftElement } from '@chakra-ui/react'
import { FaLocationArrow } from "react-icons/fa"

import { useStoreState, useStoreActions } from '../store/hooks'

export default function SearchInput() {
    const { t } = useTranslation('common')
    const geohash = useStoreState(state => state.geolocation.hash)

    return (
        <Box p={3}>
            <InputGroup boxShadow="xs" borderColor="primary.600">
                <InputLeftElement
                    color="primary.600"
                    pointerEvents="none"
                    children={<FaLocationArrow />}
                />
                <Input type="search" defaultValue={geohash ?? ''} placeholder={t('your-address')} bg="white" />
            </InputGroup>
        </Box>
    )
}