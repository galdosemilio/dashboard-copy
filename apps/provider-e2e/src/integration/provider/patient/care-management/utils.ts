export function setAutomatedTimeTrackingPreference(
  value: 'enabled' | 'disabled'
) {
  cy.fixture('api/care-management/getPreferenceOrganization').then(
    (preferences) => {
      preferences.data[0].automatedTimeTracking = value

      cy.intercept(
        'GET',
        '/1.0/care-management/preference/organization?**',
        preferences
      )
    }
  )
}

export function expectCorrectTimeTrackingRequest(organizationId, start, end) {
  cy.wait('@accountActivityPostRequest').should((xhr) => {
    expect(xhr.response.statusCode).to.equal(201)
    expect(xhr.request.body.tags.includes('rpm')).to.not.equal(true)
    expect(xhr.request.body.organization).to.equal(organizationId)
    expect(xhr.request.body.interaction.time.start).to.equal(start)
    expect(xhr.request.body.interaction.time.end).to.equal(end)
  })
}

export function shouldIncludeRpmTag() {
  cy.wait('@accountActivityPostRequest').should((xhr) => {
    expect(xhr.response.statusCode).to.equal(201)
    expect(xhr.request.body.tags.includes('rpm')).to.equal(true)
    expect(xhr.request.body.tags.includes('manual-entry')).to.not.equal(true)
  })
}

export function shouldNotIncludeRpmTag() {
  cy.wait('@accountActivityPostRequest').should((xhr) => {
    expect(xhr.response.statusCode).to.equal(201)
    expect(xhr.request.body.tags.includes('rpm')).to.not.equal(true)
    expect(xhr.request.body.tags.includes('manual-entry')).to.equal(true)
  })
}

export function expectToastNotification(message) {
  cy.get('.mat-snack-bar-container').should('contain', message)
}

export function addTime() {
  cy.get('button').contains('Add RPM Time').click()
}

export function selectMinutesAndSeconds(minutes, seconds) {
  cy.get('[cy-data="open-status-button"').click()

  cy.tick(10000)

  addTime()

  cy.get('mat-select[formControlName=minutes]')
    .find('.mat-select-value-text')
    .should('contain', '0')
  cy.get('mat-select[formControlName=seconds]')
    .find('.mat-select-value-text')
    .should('contain', '0')

  cy.get('mat-select[formControlName=minutes]')
    .click()
    .get('mat-option')
    .contains(minutes)
    .click()

  cy.get('mat-select[formControlName=seconds]')
    .click()
    .get('mat-option')
    .contains(seconds)
    .click()
}
