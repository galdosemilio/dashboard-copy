import { selectAutocompleteOption } from '../../../helpers'

export function openRPMDialog() {
  cy.get('[data-cy="open-status-button"]').click()
  cy.get('[data-cy="program_setting_button"]').click()
  cy.get('app-dialog-care-mgmt-card').eq(0).find('button').click()
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

export function confirmSupervisingProviderName(coachName: string): void {
  cy.get('[data-cy="current-supervising-provider-container"]')
    .should('contain', coachName)
    .should('contain', 'Current Supervising Provider')
}

export function confirmMessageNoSupervisingProvidersAvailable(
  openDialog: Function
): void {
  cy.intercept('GET', '/1.0/care-management/supervising-provider?**', {
    data: [],
    pagination: {}
  })

  openDialog()

  cy.get('[data-cy="change-supervising-provider-none-available"]').should(
    'contain',
    'does not have any available Supervising Providers. The clinic administrator must add at least one Supervising Provider in the Clinic Settings before RPM can be enabled for this clinic.'
  )
}

export function confirmPayloadOnSupervisingProviderUpdate(): void {
  cy.get('ccr-search-selector').eq(0).trigger('click')
  cy.get('ccr-search-selector').find('input').type('test')
  cy.tick(10000)
  selectAutocompleteOption(0)

  cy.get('[data-cy="new-supervising-provider-explanation"]').type(
    'This is a test'
  )

  cy.get('[data-cy="change-supervising-provider-save-changes-button"]').trigger(
    'click'
  )

  cy.wait('@careManagementSupervisingProviderPostRequest').should((xhr) => {
    expect(xhr.request.body.account).to.contain('7357')
    expect(xhr.request.body.note).to.equal('This is a test')
  })

  cy.get('snack-bar-container').should(
    'have.text',
    'RPM preference updated successfully.'
  )
}
