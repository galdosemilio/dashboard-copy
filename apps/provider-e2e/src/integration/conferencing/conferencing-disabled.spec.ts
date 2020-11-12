import { standardSetup } from './../../support'

describe('Organization Conferencing Preference', function () {
  it('Call button is available', function () {
    cy.setOrganization('ccr')
    standardSetup()
    cy.visit(`/messages`)

    cy.get('ccr-messages').find('ccr-call-control').should('be.visible')
  })

  it('Call button is not available', function () {
    cy.setOrganization('ccr')
    standardSetup()
    cy.visit(`/messages`)

    cy.route(
      'GET',
      '/1.0/communication/preference?organization=**',
      'fixture:/api/communication/getOrgPreference-disabled'
    )

    cy.get('ccr-messages').find('ccr-call-control').should('not.be.visible')
  })
})
