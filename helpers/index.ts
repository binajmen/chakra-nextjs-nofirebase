
export function generateId(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

export function reorder(list: string[], startIndex: number, endIndex: number) {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}
