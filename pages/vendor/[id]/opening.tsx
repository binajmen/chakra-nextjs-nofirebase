import * as React from 'react'
import produce from 'immer'
import { useRouter } from 'next/router'
import { AuthAction, useAuthUser, withAuthUser, withAuthUserSSR } from 'next-firebase-auth'
import useTranslation from 'next-translate/useTranslation'

import { Flex, Box, Heading, Switch, FormControl, FormLabel, Text, Input, HStack, Button, Spacer, useToast } from '@chakra-ui/react'
import { FaPlus, FaMinus, FaSave } from 'react-icons/fa'

import admin from '../../../src/firebase/admin'

import Vendor from '../../../src/layout/Vendor'
import { updateVendor, getOpeningHours } from '../../../src/firebase/helpers/vendors'

type OpeningHours = {
    [index: string]: {
        [index: string]: string[]
    }
}

function VendorOpeningHours() {
    const { t } = useTranslation('common')
    const authUser = useAuthUser()
    const toast = useToast()
    const router = useRouter()
    const { query: { id } } = router
    const [opening, setOpening] = React.useState<OpeningHours>({})
    const [types, setTypes] = React.useState<string[]>([])

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

            updateVendor(id as string, { opening, types })
                .then(() => toast({
                    description: "The order types and their related opening hours has been saved.",
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
        getOpeningHours(id as string)
            .then(doc => {
                if (doc.exists) {
                    setOpening(doc.data()!.opening)
                    setTypes(doc.data()!.types)
                } else {
                    toast({
                        description: "Data not found.",
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
        <Vendor>
            <Flex>
                <Heading>{t('opening-hours')}</Heading>
                <Spacer />
                <Button leftIcon={<FaSave />} color="gray.900" colorScheme="primary" onClick={saveOpeningHours}>{t('save')}</Button>
            </Flex>
            <Opening type="now"
                opening={opening} setOpening={setOpening}
                types={types} setTypes={setTypes} />
            <Opening type="takeaway"
                opening={opening} setOpening={setOpening}
                types={types} setTypes={setTypes} />
            <Opening type="delivery"
                opening={opening} setOpening={setOpening}
                types={types} setTypes={setTypes} />
        </Vendor>
    )
}

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

type OpeningProps = {
    type: string
    opening: OpeningHours
    setOpening: React.Dispatch<React.SetStateAction<OpeningHours>>
    types: string[]
    setTypes: React.Dispatch<React.SetStateAction<string[]>>
}

function Opening({ type, opening, setOpening, types, setTypes }: OpeningProps) {
    const { t } = useTranslation('common')

    const addNewTimeSlot = (day: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
        if (opening[type][day].length > 4) return

        setOpening(produce(draft => {
            draft[type][day].push('', '')
        }))
    }

    const removeLastTimeSlot = (day: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
        if (opening[type][day].length < 2) return

        setOpening(produce(draft => {
            draft[type][day].splice(draft[type][day].length - 2, 2)
        }))
    }

    const updateTimeValue = (type: string, day: string, index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.value.match(/^[0-9]{0,4}$/g)) return

        setOpening(produce(draft => {
            draft[type][day][index] = event.target.value
        }))
    }

    function switchMethod() {
        if (types.includes(type))
            setTypes(produce(draft => draft.filter((m: string) => m !== type)))
        else
            setTypes(produce(draft => { draft.push(type) }))
    }

    return (
        <Box my={3} w="full">
            <Heading size="md">{t(type)}</Heading>
            <Box pt={3}>
                <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor={`${type}-status`} mb="0">
                        {t('enabled-?')}
                    </FormLabel>
                    <Switch id={`${type}-status`}
                        isChecked={types.includes(type)}
                        onChange={switchMethod} />
                </FormControl>
            </Box>
            <Box py={3}>
                {DAYS.map((day, index) =>
                    <HStack key={index} py={1}>
                        <Text w={100}>{t(day)}</Text>
                        {opening[type]?.[day].map((time, index, src) => {
                            if (index % 2 === 0 && index + 1 < src.length) {
                                return (
                                    <React.Fragment key={index}>
                                        <Input
                                            borderRadius="md"
                                            value={time}
                                            maxW={70}
                                            size="sm"
                                            onChange={updateTimeValue(type, day, index)}
                                        />
                                        <Text>–</Text>
                                        <Input
                                            borderRadius="md"
                                            value={src[index + 1]}
                                            maxW={70}
                                            size="sm"
                                            onChange={updateTimeValue(type, day, index + 1)}
                                        />
                                    </React.Fragment>
                                )
                            } else {
                                return <Text key={index} color="gray.300">|</Text>
                            }
                        })}
                        {opening[type]?.[day].length < 5 &&
                            <Button
                                size="xs"
                                leftIcon={<FaPlus />}
                                colorScheme="green"
                                variant="ghost"
                                onClick={addNewTimeSlot(day)}
                            >{t('add')}</Button>
                        }
                        <Button
                            size="xs"
                            leftIcon={<FaMinus />}
                            colorScheme="red"
                            variant="ghost"
                            onClick={removeLastTimeSlot(day)}
                        >{t('remove')}</Button>
                    </HStack>
                )}
            </Box>
        </Box>
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
        const { id } = query

        const doc = await admin.firestore()
            .collection('roles')
            .doc(AuthUser.id!)
            .get()

        if (!doc.exists || !doc.data()!.vendors?.includes(id)) return { notFound: true }
        else return { props: {} }
    } catch (error) {
        console.error(error)
        return { notFound: true }
    }
})
