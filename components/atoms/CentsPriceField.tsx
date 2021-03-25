import * as React from 'react'

import {
  Input,
  InputGroup,
  InputRightAddon,
  InputProps
} from '@chakra-ui/react'

export type CentsPriceFieldProps = InputProps & {
  name: string
  value: any
  id: string
  onPrice: (value: number) => void
  currency?: string
}

export default function CentsPriceField(props: CentsPriceFieldProps) {
  const { name, value, id, onPrice, currency = "€", ...inputProps } = props
  const [state, setState] = React.useState<string>(`${value / 100}`)

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (/^[0-9]*$/g.test(event.target.value))
      setState(event.target.value)
  }

  function onFocus() {
    if (state === "0")
      setState("")
    else
      setState(value)
  }

  function onBlur() {
    const parsed = Number.parseInt(state || "0", 10)

    if (!Number.isNaN(parsed)) {
      onPrice(parsed)
      setState(`${parsed / 100}`)
    } else { // not a number or empty
      onPrice(0)
      setState("0")
    }
  }

  return (
    <InputGroup {...inputProps}>
      <Input name={name} id={id} value={state} onChange={onChange} onFocus={onFocus} onBlur={onBlur} />
      <InputRightAddon children={currency} />
    </InputGroup>
  )
}
