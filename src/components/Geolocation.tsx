import * as React from 'react'
import useTranslation from 'next-translate/useTranslation'

import { IconButton } from '@chakra-ui/react'
import { FaGlobeEurope } from 'react-icons/fa'

import { useStoreState, useStoreActions } from '../store/hooks'
import useGeolocation from '../hooks/useGeolocation'


export default function Geolocation() {
    const geo = useGeolocation()

    const hasError = !!geo.error
    const isLoading = geo.loading

    return (
        <IconButton
            aria-label="globe"
            icon={<FaGlobeEurope color={
                hasError
                    ? 'red'
                    : isLoading
                        ? 'orange'
                        : 'green'
            } />}
            colorScheme="primary"
            variant="ghost"
        />
    )
}