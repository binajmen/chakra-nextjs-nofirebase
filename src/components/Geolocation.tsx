import * as React from 'react'
import useTranslation from 'next-translate/useTranslation'

import {
    HStack,
    Button,
    Text,
    Divider,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure
} from '@chakra-ui/react'
import { FaLocationArrow } from 'react-icons/fa'

import { useStoreState } from '../store/hooks'

export default function Geolocation() {
    const { t } = useTranslation('common')
    const modal = useDisclosure()
    const geoColor = useStoreState(state => state.geolocation.color)
    const hasError = useStoreState(state => state.geolocation.hasError)
    const error = useStoreState(state => state.geolocation.error)
    const isLoading = useStoreState(state => state.geolocation.isLoading)
    const isReady = useStoreState(state => state.geolocation.isReady)

    return (
        <>
            <Button leftIcon={< FaLocationArrow />} color={geoColor} variant="ghost" onClick={modal.onOpen}>Géolocalisation</Button>
            <Modal size="md" isOpen={modal.isOpen} onClose={modal.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Géolocalisation</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>La fonction de géolocalisation de votre appareil est uniquement utilisée afin d'affiner les résultats en fonction de votre position géographique.</Text>
                        <Divider my={3} />
                        <HStack spacing={3}>
                            <Text>Statut</Text>
                            {hasError && <Text as="b" color={geoColor}>{error!.message}</Text>}
                            {isLoading && <Text as="b" color={geoColor}>Chargement...</Text>}
                            {isReady && <Text as="b" color={geoColor}>Active</Text>}
                        </HStack>
                        {hasError &&
                            <>
                                <Divider my={3} />
                                <Text>Si vous souhaitez profiter des avantages de la géolocalisation, veuillez autoriser notre plateforme à accèder à cette fonctionnalité.</Text>
                            </>
                        }
                    </ModalBody>

                    {/* <ModalFooter>
                        <VStack width="full">
                            <Button
                                type="submit"
                                width="full"
                                colorScheme="primary"
                                isLoading={props.isSubmitting}
                            >Sign In</Button>
                            <Button variant="link">Forgot your password?</Button>
                        </VStack>
                    </ModalFooter> */}
                </ModalContent>
            </Modal>
        </>
    )
}
