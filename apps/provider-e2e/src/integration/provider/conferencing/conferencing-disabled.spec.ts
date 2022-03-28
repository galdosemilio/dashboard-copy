import { standardSetup } from './../../../support'

describe('Organization Conferencing Preference', function () {
  it('Call button is available', function () {
    cy.setOrganization('ccr')
    standardSetup()
    cy.visit(`/messages`)

    cy.get('app-messages').find('ccr-call-control').should('be.visible')
  })

  it('Call button is not available', function () {
    cy.setOrganization('ccr')
    standardSetup({
      apiOverrides: [
        {
          url: '/1.0/communication/preference?organization=**',
          fixture: 'api/communication/getOrgPreference-disabled'
        }
      ]
    })
    cy.visit(`/messages`)

    cy.get('app-messages').find('ccr-call-control').should('not.be.visible')
  })
})
