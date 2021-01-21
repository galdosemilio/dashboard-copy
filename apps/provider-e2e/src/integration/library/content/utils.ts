export function attemptFollowFormLink(index: number): void {
  cy.get('mat-table')
    .find('mat-row')
    .eq(index)
    .trigger('dblclick', { force: true })
  cy.tick(1000)
}

export function attemptOpenFormPreviewDialog(index: number): void {
  cy.get('mat-table')
    .find('mat-row')
    .eq(index)
    .find('.cdk-column-actions')
    .find('mat-icon')
    .eq(1)
    .trigger('click', { force: true })
  cy.tick(1000)
}

export function cloneContent(): void {
  cy.get('mat-dialog-container')
    .find('button')
    .contains('Clone Content')
    .click({ force: true })
}

export function goToNextStep(): void {
  cy.get('mat-dialog-container')
    .find('button.ccr-button')
    .contains('Next')
    .click({ force: true })

  cy.tick(1000)
}

export function openBatchCloningModal(): void {
  cy.get('.ccr-library')
    .find('button')
    .contains('Clone Content')
    .click({ force: true })
  cy.tick(1000)
}

export function openSingleCloningModal(index: number): void {
  cy.get('mat-table')
    .find('mat-row')
    .eq(index)
    .find('.cdk-column-actions')
    .find('mat-icon')
    .eq(3)
    .trigger('click', { force: true })
  cy.tick(1000)
}

export function selectAvailability(availability: string): void {
  cy.get('mat-dialog-container')
    .find('mat-radio-button')
    .contains(availability)
    .click({ force: true })

  cy.tick(1000)
}

export function selectContentInModal(index: number): void {
  cy.get('mat-dialog-container')
    .find('app-content-file-explorer-table')
    .find('mat-row')
    .eq(index)
    .find('.mat-checkbox-inner-container')
    .click({ force: true })

  cy.tick(1000)
}

export function waitForModalTable(): void {
  cy.wait(4000)
}
