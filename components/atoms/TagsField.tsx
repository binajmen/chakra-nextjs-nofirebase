import * as React from 'react'
import useTranslation from 'next-translate/useTranslation'

import {
  Wrap,
  WrapItem
} from '@chakra-ui/react'

import Button from './Button'

import { TAGS } from '@/helpers/constants'

type TagsFieldProps = {
  tags: string[]
  onTag: (tags: string[]) => void
}

export default function TagsField({ tags, onTag }: TagsFieldProps) {
  const { t } = useTranslation('admin')

  function switchTag(tag: string) {
    if (tags.includes(tag)) {
      onTag(tags.filter(t => t !== tag))
    } else {
      onTag([...tags, tag].sort((a, b) => TAGS.indexOf(a) - TAGS.indexOf(b)))
    }
  }

  return (
    <Wrap>
      {TAGS.map(tag =>
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
