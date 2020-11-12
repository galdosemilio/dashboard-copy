export interface SupplementDataResponseSegment {
  date: string
  consumption: Array<{
    supplement: {
      id: string
      name: string
      shortName: string
    }
    quantity: number
  }>
}
