import * as React from "react"
import RGPA from "react-google-places-autocomplete"
import { geocodeByPlaceId } from "react-google-places-autocomplete"
import { geohashForLocation } from 'geofire-common'

import { Box } from "@chakra-ui/react"

import type { Address } from '@/types/shared'

type AddressFieldProps = {
  onAddress: (address: Address) => void
  placeholder: string
  noOptions: string
}

export default function AddressField({ onAddress, placeholder, noOptions }: AddressFieldProps) {
  const [value, setValue] = React.useState<any>("")

  React.useEffect(() => {
    if (!value) return

    geocodeByPlaceId(value.value.place_id)
      .then((results: any) => {
        const address = {
          address: results[0].formatted_address,
          addressId: results[0].place_id,
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
          geohash: geohashForLocation([
            results[0].geometry.location.lat(),
            results[0].geometry.location.lng()
          ], 9)
        }
        onAddress(address)
        setValue("")
      })
      .catch((error) => console.error(error))
  }, [value])

  return (
    <Box w="full">
      <RGPA
        apiKey="AIzaSyAlLBvlq6YsDDaidjMwyPpsdHcAIhUq2gY"
        apiOptions={{ language: 'fr' }}
        autocompletionRequest={{
          componentRestrictions: {
            country: ['be'],
          },
        }}
        debounce={1000}
        minLengthAutocomplete={5}
        onLoadFailed={(error) => (
          console.error("Could not inject Google script:", error)
        )}
        selectProps={{
          value,
          onChange: setValue,
          placeholder: placeholder,
          noOptionsMessage: () => noOptions
        }}
        withSessionToken={true}
      />
    </Box>
  )
}
