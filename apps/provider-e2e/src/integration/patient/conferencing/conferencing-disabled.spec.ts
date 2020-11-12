import { standardSetup } from './../../../support'

describe('Organization Conferencing Preference', function () {
  beforeEach(() => {
    cy.setOrganization('ccr')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)
  })

  it('Call button is available', function () {
    cy.get('app-dieter').find('ccr-call-control').should('be.visible')

    // Main buttons
    cy.get('.ccr-tabs')
    cy.get('app-right-panel')
      .find('app-rightpanel-note')
      .should('have.length', 3)
  })

  it('Call button is not available', function () {
    cy.route(
      'GET',
      '/1.0/communication/preference?organization=**',
      'fixture:/api/communication/getOrgPreference-disabled'
    )

    cy.get('app-dieter').find('ccr-call-control').should('not.be.visible')

    // Main buttons
    cy.get('.ccr-tabs')
    cy.get('app-right-panel')
      .find('app-rightpanel-note')
      .should('have.length', 3)
  })
})
