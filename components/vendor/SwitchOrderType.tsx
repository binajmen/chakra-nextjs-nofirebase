import * as React from 'react'
import produce from 'immer'
import useTranslation from 'next-translate/useTranslation'

import { Box, Switch, FormControl, FormLabel } from '@chakra-ui/react'

type SwitchOrderTypeProps = {
  method: string
  methods: string[]
  setMethods: React.Dispatch<React.SetStateAction<string[]>>
}

export default function SwitchOrderType({ method, methods, setMethods }: SwitchOrderTypeProps) {
  const { t } = useTranslation('common')

  function switchMethod() {
    if (methods.includes(method))
      setMethods(produce(draft => draft.filter((m: string) => m !== method)))
    else
      setMethods(produce(draft => { draft.push(method) }))
  }

  return (
    <Box py={3}>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor={`${method}-status`} mb="0">
          {t('enabled-?')}
        </FormLabel>
        <Switch id={`${method}-status`} isChecked={methods.includes(method)} onChange={switchMethod} />
      </FormControl>
    </Box>
  )
}
