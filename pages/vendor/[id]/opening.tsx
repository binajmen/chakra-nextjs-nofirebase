import * as React from 'react'
import produce from 'immer'
import { useRouter } from 'next/router'
import { AuthAction, useAuthUser, withAuthUser } from 'next-firebase-auth'
import useTranslation from 'next-translate/useTranslation'

import { Flex, Box, Heading, Switch, FormControl, FormLabel, Text, Input, HStack, Button, Spacer } from '@chakra-ui/react'
import { FaPlus, FaMinus, FaSave } from 'react-icons/fa'

import Vendor from '../../../src/layout/Vendor'

type OpeningType = {
    [index: string]: {
        [index: string]: string[]
    }
}

const openingHours: OpeningType = {
    now: {
        mon: ['1130', '1400', '1800', '2200'],
        tue: ['1130', '1400', '1800', '2200'],
        wed: ['1130', '1400', '1800', '2200'],
        thu: ['1130', '1400', '1800', '2200'],
        fri: ['1130', '1400', '1800', '2200'],
        sat: ['0900', '1400', '1800', '2200'],
        sun: ['0900', '1400', '1800', '2200']
    },
    takeaway: {
        mon: ['1130', '1400', '1800', '2200'],
        tue: ['1130', '1400', '1800', '2200'],
        wed: ['1130', '1400', '1800', '2200'],
        thu: ['1130', '1400', '1800', '2200'],
        fri: ['1130', '1400', '1800', '2200'],
        sat: ['0900', '1400', '1800', '2200'],
        sun: ['0900', '1400', '1800', '2200']
    },
    delivery: {
        mon: ['1130', '1400', '1800', '2200'],
        tue: ['1130', '1400', '1800', '2200'],
        wed: ['1130', '1400', '1800', '2200'],
        thu: ['1130', '1400', '1800', '2200'],
        fri: ['1130', '1400', '1800', '2200'],
        sat: ['0900', '1400', '1800', '2200'],
        sun: ['0900', '1400', '1800', '2200']
    }
}

const METHODS = ['now', 'takeaway', 'delivery']

function VendorOpeningHours() {
    const { t } = useTranslation('common')
    const authUser = useAuthUser()
    const router = useRouter()
    const { query: { id } } = router
    const [opening, setOpening] = React.useState<OpeningType>(openingHours)
    const [methods, setMethods] = React.useState<string[]>(METHODS)

    function saveOpeningHours() {
        try {
            Object.entries(opening).forEach(([method, days]) => {
                Object.entries(days).forEach(([day, slots]) => {
                    if (slots.length % 2 !== 0) throw new Error(`Uneven entries for: ${t(method)} / ${t(day)}`)
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
                    if (!success) throw new Error(`Wrong format/order for: ${t(method)} / ${t(day)}`)
                })
            })
            window.alert("good format")
        } catch (error) {
            window.alert(error)
        }
    }

    // TODO: <Vendor> title props to add in <Head>
    return (
        <Vendor>
            <Flex>
                <Heading>{t('opening-hours')}</Heading>
                <Spacer />
                <Button leftIcon={<FaSave />} color="gray.900" colorScheme="primary" onClick={saveOpeningHours}>{t('save')}</Button>
            </Flex>
            <Opening method="now"
                opening={opening} setOpening={setOpening}
                methods={methods} setMethods={setMethods} />
            <Opening method="takeaway"
                opening={opening} setOpening={setOpening}
                methods={methods} setMethods={setMethods} />
            <Opening method="delivery"
                opening={opening} setOpening={setOpening}
                methods={methods} setMethods={setMethods} />
        </Vendor>
    )
}

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

type OpeningProps = {
    method: string
    opening: OpeningType
    setOpening: React.Dispatch<React.SetStateAction<OpeningType>>
    methods: string[]
    setMethods: React.Dispatch<React.SetStateAction<string[]>>
}

function Opening({ method, opening, setOpening, methods, setMethods }: OpeningProps) {
    const { t } = useTranslation('common')

    const addNewTimeSlot = (day: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
        if (opening[method][day].length > 4) return

        setOpening(produce(draft => {
            draft[method][day].push('', '')
        }))
    }

    const removeLastTimeSlot = (day: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
        if (opening[method][day].length < 2) return

        setOpening(produce(draft => {
            draft[method][day].splice(draft[method][day].length - 2, 2)
        }))
    }

    const updateTimeValue = (method: string, day: string, index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.value.match(/^[0-9]{0,4}$/g)) return

        setOpening(produce(draft => {
            draft[method][day][index] = event.target.value
        }))
    }

    function switchMethod() {
        if (methods.includes(method))
            setMethods(produce(draft => draft.filter((m: string) => m !== method)))
        // setMethods(produce(draft => draft = draft.filter((m: string) => m === method)))
        else
            setMethods(produce(draft => { draft.push(method) }))
    }

    return (
        <Box my={3} w="full">
            <Heading size="md">{t(method)}</Heading>
            <Box pt={3}>
                <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor={`${method}-status`} mb="0">
                        {t('enabled-?')}
                    </FormLabel>
                    <Switch id={`${method}-status`}
                        isChecked={methods.includes(method)}
                        onChange={switchMethod} />
                </FormControl>
            </Box>
            <Box py={3}>
                {DAYS.map((day, index) =>
                    <HStack key={index} py={1}>
                        <Text w={100}>{t(day)}</Text>
                        {opening[method][day].map((time, index, src) => {
                            if (index % 2 === 0 && index + 1 < src.length) {
                                return (
                                    <React.Fragment key={index}>
                                        <Input
                                            borderRadius="md"
                                            value={time}
                                            maxW={70}
                                            size="sm"
                                            onChange={updateTimeValue(method, day, index)}
                                        />
                                        <Text>–</Text>
                                        <Input
                                            borderRadius="md"
                                            value={src[index + 1]}
                                            maxW={70}
                                            size="sm"
                                            onChange={updateTimeValue(method, day, index + 1)}
                                        />
                                    </React.Fragment>
                                )
                            } else {
                                return <Text key={index} color="gray.300">|</Text>
                            }
                        })}
                        {opening[method][day].length < 5 &&
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

// https://github.com/vinissimus/next-translate/issues/487
export function getServerSideProps() { return { props: {} }; }
