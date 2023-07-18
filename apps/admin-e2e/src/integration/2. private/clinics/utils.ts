export function verifyActiveOption(section, option) {
  cy.get(`[data-cy="org-settings-section-care-${section}"]`)
    .find(`[data-cy="care-preference-active-option"]`)
    .find('.mat-select')
    .should('contain', option)
}

export function verifyDeviceSetupNotification(section, state) {
  cy.get(`[data-cy="org-settings-section-care-${section}"]`)
    .find('[data-cy="care-preference-device-setup-notification"]')
    .find('.mat-slide-toggle-input')
    .should(state)
}

export function verifyAutomaticTimeTracking(section, option) {
  cy.get(`[data-cy="org-settings-section-care-${section}"]`)
    .find('[data-cy="care-preference-automated-time-tracking-option"]')
    .find('.mat-select')
    .should('contain', option)
}

export function selectActiveOption(type, option) {
  cy.get(`[data-cy="org-settings-section-care-${type}"]`)
    .find('[data-cy="care-preference-active-option"]')
    .find('.mat-select')
    .eq(0)
    .trigger('click')
    .wait(500)

  cy.get('.mat-select-panel')
    .find('mat-option')
    .contains(option)
    .trigger('click')
    .trigger('blur', { force: true })
    .wait(500)

  cy.tick(1000)
}
