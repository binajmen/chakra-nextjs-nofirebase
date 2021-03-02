import * as React from "react"
import useTranslation from 'next-translate/useTranslation'

import { useToast } from '@chakra-ui/react'
import { useStoreState, useStoreActions } from '../store/hooks'

export default function Toaster() {
    const { t } = useTranslation('common')
    const toast = useToast()

    const hasNewToast = useStoreState(state => state.ui.hasNewToast)
    const message = useStoreState(state => state.ui.message)
    const status = useStoreState(state => state.ui.status)

    const resetToast = useStoreActions(actions => actions.ui.resetToast)

    React.useEffect(() => {
        if (hasNewToast) {
            toast({
                description: t(message),
                status: status
            })
            resetToast()
        }
    }, [hasNewToast])

    return null
}