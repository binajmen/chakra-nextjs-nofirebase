import * as React from 'react'
import useTranslation from 'next-translate/useTranslation'

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  UseDisclosureProps
} from '@chakra-ui/react'
import { FaPlus } from 'react-icons/fa'

import Button from '@/components/atoms/Button'

type SelectionModalProps = {
  modal: UseDisclosureProps
  title: string
  selected: string[]
  items: any[]
  keys: string[]
  transform?: { [index: string]: (value: any) => any }
  add: (item: any) => void
}

export default function SelectionModal({ modal, title, selected, items, keys, transform = {}, add }: SelectionModalProps) {
  const { t } = useTranslation('admin')

  const list = React.useMemo(() => {
    return items.filter(i => !selected.includes(i.id))
  }, [items, selected])

  return (
    <Modal onClose={modal.onClose!} size="4xl" isOpen={modal.isOpen!}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                {keys.map(key => (
                  <Th key={key}>{t(key)}</Th>
                ))}
                <Th w="1"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {list.map(item => (
                <Tr key={item.id} _hover={{ bgColor: 'primary.50' }}>
                  {keys.map(key => (
                    <Td key={key}>
                      {(transform && key in transform) ? transform[key](item[key]) : item[key]}
                    </Td>
                  ))}
                  <Td>
                    <Button
                      leftIcon={<FaPlus />}
                      size="xs"
                      onClick={() => add(item)}
                    >
                      {t('add')}
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button onClick={modal.onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
