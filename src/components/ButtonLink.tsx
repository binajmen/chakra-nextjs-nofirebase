import NextLink from 'next/link'

import {
    Button,
    ButtonProps
} from '@chakra-ui/react'

type ButtonLinkProps = ButtonProps & {
    pathname: string
    query?: any
}

export default function ButtonLink(props: ButtonLinkProps) {
    const { pathname, query = {}, children, ...buttonProps } = props

    return (
        <NextLink href={{ pathname, query }}>
            <Button {...buttonProps}>
                {children}
            </Button>
        </NextLink>
    )
}
