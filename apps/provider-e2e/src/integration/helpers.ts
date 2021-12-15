export function assertElement(element, contains: string[]): void {
  contains.forEach((requiredString) =>
    element.should('contain', requiredString)
  )
}

export function assertTableRow(row, contains: string[]): void {
  contains.forEach((requiredString) => row.should('contain', requiredString))
}
