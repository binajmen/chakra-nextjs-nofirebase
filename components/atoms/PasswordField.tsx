import * as React from 'react'
import useTranslation from 'next-translate/useTranslation'
import { FieldInputProps } from 'formik'

import {
  InputGroup,
  Input,
  InputRightElement,
  Button
} from "@chakra-ui/react"

type PasswordFieldProps = FieldInputProps<string> & {
  id: string
  placeholder: string
}

export default function PasswordField({ id, placeholder, ...fieldProps }: PasswordFieldProps) {
  const { t } = useTranslation("common")
  const [show, setShow] = React.useState(false)

  const handleClick = () => setShow(!show)

  return (
    <InputGroup size="md">
      <Input
        {...fieldProps}
        pr="6rem"
        type={show ? "text" : "password"}
        id={id}
        placeholder={placeholder}
      />
      <InputRightElement width="auto" pr="0.3rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
          {show ? t("hide") : t("show")}
        </Button>
      </InputRightElement>
    </InputGroup>
  )
}