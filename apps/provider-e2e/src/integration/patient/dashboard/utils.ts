export function openRPMDialog() {
  cy.get('mat-slide-toggle:not(.mat-disabled)').trigger('click', { force: true });
  cy.tick(1000);
}

export function openRPMReportDialog() {
  cy.get('button').contains('Download Report').trigger('click', { force: true });
  cy.tick(1000);
}

export function attemptToDisableRpm() {
  cy.get('button').contains('Disable RPM').click({ force: true });
  cy.tick(1000);
  cy.get('button').contains('Yes').click({ force: true });
  cy.tick(1000);
}

export function attemptToDownloadPatientReport(type: 'PDF' | 'Excel') {
  cy.get('mat-dialog-container')
    .find('mat-radio-button', { timeout: 40000 })
    .contains(type)
    .click({ force: true });
  cy.tick(1000);
  cy.get('mat-dialog-container')
    .find('button')
    .contains('Download')
    .click({ force: true });
  cy.tick(1000);
}

export function attemptToEnableRpm() {
  cy.get('button').contains('Enable RPM').click({ force: true });

  cy.tick(1000);

  cy.get('mat-dialog-container')
    .find('.mat-checkbox-inner-container')
    .click({ force: true, multiple: true });

  cy.tick(1000);

  cy.get('button').contains('Enable RPM').click({ force: true });

  cy.tick(1000);
}
