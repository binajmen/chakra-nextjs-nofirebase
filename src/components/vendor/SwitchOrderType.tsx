import * as React from 'react'
import produce from 'immer'
import useTranslation from 'next-translate/useTranslation'

import { Box, Switch, FormControl, FormLabel } from '@chakra-ui/react'

type SwitchOrderTypeProps = {
    type: string
    types: string[]
    setTypes: React.Dispatch<React.SetStateAction<string[]>>
}

export default function SwitchOrderType({ type, types, setTypes }: SwitchOrderTypeProps) {
    const { t } = useTranslation('common')

    function switchMethod() {
        if (types.includes(type))
            setTypes(produce(draft => draft.filter((m: string) => m !== type)))
        else
            setTypes(produce(draft => { draft.push(type) }))
    }

    return (
        <Box py={3}>
            <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor={`${type}-status`} mb="0">
                    {t('enabled-?')}
                </FormLabel>
                <Switch id={`${type}-status`} isChecked={types.includes(type)} onChange={switchMethod} />
            </FormControl>
        </Box>
    )
}
