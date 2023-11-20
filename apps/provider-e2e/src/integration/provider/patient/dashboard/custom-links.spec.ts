import { ValidOrganization } from '../../../../support/organizations'
import { standardSetup } from './../../../../support'

describe('Patient Dashboard Custom Links', function () {
  describe('visibilities', function () {
    it('Should not show custom links in default', function () {
      customLinkVisibilities('ccr', false)
    })
    it('Should show custom links in conci', function () {
      customLinkVisibilities('conci', true)
    })
  })

  describe('actions', function () {
    beforeEach(() => {
      cy.setOrganization('conci')
      cy.setTimezone('et')
      standardSetup()

      cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)
    })

    it('should goto files correctly', () => {
      cy.get('app-dieter').find('.ccr-button').contains('File Vault').click()
      cy.url().should('include', '/settings;s=file-vault')
    })

    it('should goto forms and select diagnosis form', () => {
      cy.get('app-dieter')
        .find('.ccr-button')
        .contains('Diagnosis Form')
        .click()
      cy.url().should('include', '/settings;s=forms;formId=1915')

      cy.tick(20000)

      cy.get('app-library-dieter-submissions')
        .find('form-search')
        .find('.mat-select')
        .should('contain', '1 - Diagnosis')
    })
  })
})

function customLinkVisibilities(org: ValidOrganization, visible: boolean) {
  cy.setOrganization(org)
  cy.setTimezone('et')
  standardSetup()

  cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

  cy.get('app-dieter').should('exist')
  cy.get('app-dieter')
    .find('.ccr-button')
    .contains('File Vault')
    .should(visible ? 'exist' : 'not.exist')
  cy.get('app-dieter')
    .find('.ccr-button')
    .contains('Diagnosis Form')
    .should(visible ? 'exist' : 'not.exist')
}
