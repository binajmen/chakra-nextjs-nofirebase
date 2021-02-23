import * as React from 'react'
import useTranslation from 'next-translate/useTranslation'

import {
    Button,
    Icon,
    Menu,
    MenuButton,
    MenuList,
    MenuItemOption,
    MenuOptionGroup,
    useBreakpointValue
} from '@chakra-ui/react'
import { FaChevronDown, FaAngleDown, FaChair, FaWalking, FaBicycle } from 'react-icons/fa'
import type { IconType } from 'react-icons'

import { useStoreState, useStoreActions } from '../store/hooks'

const icons: { [index: string]: IconType } = {
    now: FaChair,
    takeaway: FaWalking,
    delivery: FaBicycle
}

export default function MethodMenu() {
    const { t } = useTranslation('common')
    const method = useStoreState(state => state.session.method)
    const setMethod = useStoreActions(actions => actions.session.setMethod)
    const isMobile = useBreakpointValue({ base: true, md: false })

    return (
        <Menu>
            <MenuButton as={Button} rightIcon={<FaChevronDown />} color="black" colorScheme="primary">
                <Icon as={icons[method as string]} mr={isMobile ? 0 : 3} />
                {!isMobile && <span>{t(method as string)}</span>}
            </MenuButton>
            <MenuList>
                <MenuOptionGroup defaultValue={method as string} type="radio">
                    <MenuItemOption value="now" onClick={() => setMethod('now')}>
                        <Icon as={FaChair} mr={3} />
                        <span>{t('now')}</span>
                    </MenuItemOption>
                    <MenuItemOption value="takeaway" onClick={() => setMethod('takeaway')}>
                        <Icon as={FaWalking} mr={3} />
                        <span>{t('takeaway')}</span>
                    </MenuItemOption>
                    <MenuItemOption value="delivery" onClick={() => setMethod('delivery')}>
                        <Icon as={FaBicycle} mr={3} />
                        <span>{t('delivery')}</span>
                    </MenuItemOption>
                </MenuOptionGroup>
            </MenuList>
        </Menu>
    )
}