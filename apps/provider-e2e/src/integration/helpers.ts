export function assertElement(element, contains: string[]): void {
  contains.forEach((requiredString) =>
    element.should('contain', requiredString)
  )
}

export function assertTableRow(row, contains: string[]): void {
  contains.forEach((requiredString) => row.should('contain', requiredString))
}

export function selectOption(selectorElement, optionName: string): void {
  selectorElement
    .find('.mat-select-trigger')
    .trigger('click', { force: true })
    .wait(500)

  cy.get('.mat-option').contains(optionName).trigger('click')
  cy.tick(1000)
}
