import * as React from 'react'
import produce from 'immer'
import useTranslation from 'next-translate/useTranslation'

import { Box, Text, Input, HStack, Button } from '@chakra-ui/react'
import { FaPlus, FaMinus } from 'react-icons/fa'

import type { OpeningHours } from '@/types/place'

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

type TimetableProps = {
  method: string
    opening: OpeningHours
    setOpening: React.Dispatch<React.SetStateAction<OpeningHours>>
}

export default function Timetable({ method, opening, setOpening }: TimetableProps) {
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

    return (
        <Box py={3}>
            {DAYS.map((day, index) =>
                <HStack key={index} py={1}>
                    <Text w={100}>{t(day)}</Text>
                    {opening[method]?.[day].map((time, index, src) => {
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
                    {opening[method]?.[day].length < 5 &&
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
                    >{t('delete')}</Button>
                </HStack>
            )}
        </Box>
    )
}