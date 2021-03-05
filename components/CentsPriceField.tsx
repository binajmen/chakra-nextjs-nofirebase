import * as React from 'react'
import { FieldProps } from 'formik'

import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    InputGroup,
    InputRightAddon
} from '@chakra-ui/react'

export type PriceFieldProps = FieldProps & {
    id: string
    label: string
    placeholder?: string
    helperText?: string
    currency?: string
}

export default function CentsPriceField({
    field, form, meta, // Formik FieldProps
    id, label, placeholder, helperText, currency = "€" // Component Props
}: PriceFieldProps) {
    const [state, setState] = React.useState<string>(`${field.value / 100}`)

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (/^[0-9]*$/g.test(event.target.value))
            setState(event.target.value)
    }

    function onFocus() {
        if (state === "0")
            setState("")
        else
            setState(field.value)
    }

    function onBlur() {
        const parsed = Number.parseInt(state || "0", 10)

        if (!Number.isNaN(parsed)) {
            form.setFieldValue(id, parsed)
            setState(`${parsed / 100}`)
        } else { // not a number or empty
            form.setFieldValue(id, 0)
            setState("0")
        }
    }

    return (
        <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired>
            <FormLabel htmlFor={id}>{label}</FormLabel>
            <InputGroup size="sm">
                <Input {...field} value={state} onChange={onChange} onFocus={onFocus} onBlur={onBlur} id={id} placeholder={placeholder ?? ""} />
                <InputRightAddon children={currency} />
            </InputGroup>
            {!!helperText && <FormHelperText>{helperText}</FormHelperText>}
            <FormErrorMessage>{form.errors[id]}</FormErrorMessage>
        </FormControl>
    )
}
