import * as React from 'react'
import useTranslation from 'next-translate/useTranslation'

import {
  Wrap,
  WrapItem
} from '@chakra-ui/react'

import Button from './Button'

import { TAGS } from '@/helpers/constants'

type TagsFieldProps = {
  allTags?: string[]
  tags: string[]
  limit: number
  onTag: (tags: string[]) => void
}

export default function TagsField({ allTags = TAGS, tags, limit, onTag }: TagsFieldProps) {
  const { t } = useTranslation("common")

  function switchTag(tag: string) {
    if (tags.includes(tag)) {
      onTag(tags.filter(t => t !== tag))
    } else if (tags.length < limit) {
      onTag([...tags, tag].sort((a, b) => TAGS.indexOf(a) - TAGS.indexOf(b)))
    }
  }

  return (
    <Wrap>
      {allTags.map(tag =>
        <WrapItem key={tag}>
          <Button
            size="sm"
            colorScheme={tags.includes(tag) ? "primary" : "gray"}
            onClick={() => switchTag(tag)}
          >
            {t(tag)}
          </Button>
        </WrapItem>
      )}
    </Wrap>
  )
}
