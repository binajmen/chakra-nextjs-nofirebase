import * as React from 'react'
import { useRouter } from 'next/router'
import { AuthAction, withAuthUser, withAuthUserSSR } from 'next-firebase-auth'
import useTranslation from 'next-translate/useTranslation'

import { Flex, Box, Heading, Button, Spacer, useToast } from '@chakra-ui/react'
import { FaSave } from 'react-icons/fa'

import admin from '../../../src/firebase/admin'
import { updateVendor, getOpeningHours } from '../../../src/firebase/helpers/vendors'

import VendorLayout from '../../../src/layout/Vendor'

import SwitchOrderType from '../../../src/components/vendor/SwitchOrderType'
import Timetable from '../../../src/components/vendor/Timetable'

import type { OpeningHours } from '../../../src/types/vendor'

const TYPES = ['now', 'takeaway', 'delivery']

function VendorOpeningHours() {
    const { t } = useTranslation('common')
    const toast = useToast()
    const router = useRouter()

    const [opening, setOpening] = React.useState<OpeningHours>({})
    const [types, setTypes] = React.useState<string[]>([])

    const { query: { vendorId } } = router

    function saveOpeningHours() {
        try {
            Object.entries(opening).forEach(([type, days]) => {
                Object.entries(days).forEach(([day, slots]) => {
                    if (slots.length % 2 !== 0) throw new Error(`Uneven entries for: ${t(type)} / ${t(day)}`)
                    const success = slots.every((slot, index, array) => {
                        if (index === array.length - 1) return true
                        else if (
                            index + 1 <= array.length - 1 &&
                            slot < array[index + 1] &&
                            slot.length === 4 &&
                            array[index + 1].length === 4
                        ) return true
                        else return false
                    })
                    if (!success) throw new Error(`Wrong format and/or order for: ${t(type)} / ${t(day)}`)
                })
            })

            updateVendor(vendorId as string, { opening, types })
                .then(() => toast({
                    description: t('vendor:changes-saved'),
                    status: "success"
                }))
                .catch((error) => { throw new Error(error) })
        } catch (error) {
            toast({
                description: error.message,
                status: "error"
            })
        }
    }

    React.useEffect(() => {
        getOpeningHours(vendorId as string)
            .then(doc => {
                if (doc.exists) {
                    setOpening(doc.data()!.opening)
                    setTypes(doc.data()!.types)
                } else {
                    toast({
                        description: t('vendor:not-found'),
                        status: "warning"
                    })
                    router.push('/vendor')
                }
            })
            .catch(error => {
                toast({
                    description: error,
                    status: "error"
                })
                router.push('/404')
            })
    }, [])

    // TODO: <Vendor> title props to add in <Head>
    return (
        <VendorLayout>

            <Flex>
                <Heading>{t('opening-hours')}</Heading>
                <Spacer />
                <Button leftIcon={<FaSave />} color="gray.900" colorScheme="primary" onClick={saveOpeningHours}>{t('save')}</Button>
            </Flex>

            {TYPES.map((type, index) =>
                <Box key={index} my={3} w="full">
                    <Heading size="md">{t(type)}</Heading>
                    <SwitchOrderType type={type} types={types} setTypes={setTypes} />
                    <Timetable type={type} opening={opening} setOpening={setOpening} />
                </Box>
            )}

        </VendorLayout>
    )
}

export default withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(VendorOpeningHours)

export const getServerSideProps = withAuthUserSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ query, AuthUser }) => {
    try {
        // retrieve vendor id
        const { vendorId } = query

        // retrieve roles for the current user
        const doc = await admin.firestore()
            .collection('roles')
            .doc(AuthUser.id!)
            .get()

        // if no roles or no roles for the requested vendor, 404
        if (!doc.exists || !doc.data()!.vendors?.includes(vendorId)) return { notFound: true }

        // else
        return { props: {} }
    } catch (error) {
        console.error(error)
        return { notFound: true }
    }
})
