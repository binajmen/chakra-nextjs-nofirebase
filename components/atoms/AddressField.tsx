import * as React from "react"
import RGPA from "react-google-places-autocomplete"
import { geocodeByPlaceId } from "react-google-places-autocomplete"

import type { Address } from '@/types/customer'

type AddressFieldProps = {
  onAddress: (address: Address) => void
}

export default function AddressField({ onAddress }: AddressFieldProps) {
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
          geohash: ""
        }
        onAddress(address)
        setValue("")
      })
      .catch((error) => console.error(error))
  }, [value])

  return (
    <div className="App">
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
          onChange: setValue
        }}
        withSessionToken={true}
      />
    </div>
  )
}
