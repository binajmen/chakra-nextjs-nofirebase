import * as React from 'react'

import {
  Drawer as ChakraDrawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerProps
} from '@chakra-ui/react'

type MyDrawerProps = DrawerProps & {
  header: JSX.Element
  footer: JSX.Element
  isOpen: boolean
  onClose: () => void
}

export default function Drawer(props: MyDrawerProps) {
  const { header, children, footer, isOpen, onClose, ...drawerProps } = props

  return (
    <ChakraDrawer onClose={onClose} isOpen={isOpen} {...drawerProps}>
      <DrawerOverlay heigth="100% !important">
        <DrawerContent heigth="100% !important">
          <DrawerCloseButton />
          <DrawerHeader>
            {header}
          </DrawerHeader>
          <DrawerBody>
            {children}
          </DrawerBody>
          <DrawerFooter>
            {footer}
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </ChakraDrawer>
  )
}
