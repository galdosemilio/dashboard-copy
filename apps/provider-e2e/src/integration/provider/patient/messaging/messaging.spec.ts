import { standardSetup } from '../../../../support'

describe('Messaging Feature for Patient Profile', function () {
  it('Saves a draft', function () {
    cy.setOrganization('ccr')
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/messages`)

    cy.get('ccr-messages')
      .find('textarea')
      .should('be.enabled')
      .wait(500)
      .type('this is a test')

    cy.tick(10000)

    cy.wait('@upsertMessageDraft', { timeout: 10000 }).should((xhr) => {
      expect(xhr.request.body.data.patientMessage).to.equal('this is a test')
    })
  })
})