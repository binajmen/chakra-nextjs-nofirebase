import * as React from 'react'
import { useRouter } from 'next/router'

import { Select } from "@chakra-ui/react"

export default function Menu() {
  const router = useRouter()
  const { locale, pathname, query } = router

  function onSelect(event: React.ChangeEvent<HTMLSelectElement>) {
    router.push({ pathname, query }, undefined, { locale: event.target.value })
  }

  return (
    <Select
      colorScheme="primary"
      onChange={onSelect}
      defaultValue={locale}
    >
      <option value="fr">Français</option>
      <option value="nl">Nederlands</option>
      <option value="en">English</option>
    </Select>
  )
}
