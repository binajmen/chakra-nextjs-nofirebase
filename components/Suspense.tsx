import {
  Center,
  Spinner,
  Text
} from '@chakra-ui/react'

export function Loading() {
  return (
    <Center h="69%">
      <Spinner />
      <Text ml="3">Loading..</Text>
    </Center>
  )
}

type ErrorProps = {
  error: any
}

export function Error({ error }: ErrorProps) {
  return (
    <Center h="69%">
      {error}
    </Center>
  )
}