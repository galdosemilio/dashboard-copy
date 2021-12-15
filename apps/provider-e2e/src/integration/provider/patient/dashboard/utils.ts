export function openRPMDialog() {
  cy.get('mat-slide-toggle:not(.mat-disabled)').trigger('click', {
    force: true
  })
  cy.tick(1000)
}

export function openRPMReportDialog() {
  cy.get('button').contains('Download Report').trigger('click', { force: true })
  cy.tick(1000)
}

export function attemptToDisableRpm(reason?: string, note?: string) {
  cy.get('mat-dialog-container')
    .find('button')
    .contains('Disable RPM')
    .click({ force: true })
  cy.tick(1000)

  if (reason) {
    cy.get('mat-dialog-container').find('div.mat-select-trigger').click()
    cy.tick(1000)
    cy.get('mat-option').contains(reason).click()
    cy.tick(1000)

    cy.get('mat-dialog-container')
      .find('textarea')
      .should('be.enabled')
      .clear()
      .type(note)

    cy.tick(1000)
  }

  cy.get('button').contains('Yes').click({ force: true })
  cy.tick(1000)
}

export function attemptToDownloadPatientReport(type: 'PDF' | 'Excel') {
  cy.get('mat-dialog-container')
    .find('mat-radio-button', { timeout: 40000 })
    .contains(type)
    .click({ force: true })
  cy.tick(1000)
  cy.get('mat-dialog-container')
    .find('button')
    .contains('Download')
    .click({ force: true })
  cy.tick(1000)
}

export function attemptToEditRPM(explanation?: string) {
  cy.get('mat-dialog-container')
    .find('button')
    .contains('Edit Diagnosis')
    .click({ force: true })

  cy.tick(1000)

  cy.get('mat-dialog-container')
    .find('textarea')
    .eq(0)
    .clear()
    .type('edited primary diagnosis')

  cy.tick(1000)

  cy.get('mat-dialog-container')
    .find('textarea')
    .eq(1)
    .clear()
    .type('edited secondary diagnosis')

  if (explanation) {
    cy.get('mat-dialog-container')
      .find('textarea')
      .eq(2)
      .clear()
      .type(explanation)
  }

  cy.tick(1000)

  cy.get('mat-dialog-container')
    .find('button')
    .contains('Save Changes')
    .click({ force: true })

  cy.tick(1000)
}

export function attemptToEnableRpm() {
  cy.get('mat-dialog-container')
    .find('textarea')
    .should('be.enabled')
    .eq(0)
    .type('test primary diagnosis')

  cy.tick(1000)

  cy.get('mat-dialog-container')
    .find('button')
    .contains('Next')
    .click({ force: true })

  cy.tick(1000)

  cy.get('mat-dialog-container')
    .find('.mat-checkbox-inner-container')
    .click({ force: true, multiple: true })

  cy.tick(1000)

  cy.get('mat-dialog-container')
    .find('button')
    .contains('Next')
    .click({ force: true })

  cy.tick(1000)

  cy.get('mat-dialog-container')
    .find('.image-option')
    .eq(0)
    .click({ force: true })

  cy.tick(1000)

  cy.get('button').contains('Enable RPM').click({ force: true })

  cy.tick(1000)
}
