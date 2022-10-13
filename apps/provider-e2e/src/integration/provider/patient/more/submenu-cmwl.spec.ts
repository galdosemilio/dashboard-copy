import { standardSetup } from '../../../../support'

describe('Patient profile -> more -> submenu (cmwl)', function () {
  before(() => {
    cy.setOrganization('cmwl')
    standardSetup()
  })

  it('Correct submenu links', function () {
    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings`)

    cy.get('app-dieter-settings', {
      timeout: 12000
    })
      .find('li')
      .as('menuLinks')

    cy.get('@menuLinks').should('have.length', 11)
    cy.get('@menuLinks').eq(0).should('contain', 'Profile')
    cy.get('@menuLinks').eq(1).should('contain', 'Addresses')
    cy.get('@menuLinks').eq(2).should('contain', 'Phases')
    cy.get('@menuLinks').eq(3).should('contain', 'Devices')
    cy.get('@menuLinks').eq(4).should('contain', 'Forms')
    cy.get('@menuLinks').eq(5).should('contain', 'Communications')
    cy.get('@menuLinks').eq(6).should('contain', 'Clinics')
    cy.get('@menuLinks').eq(7).should('contain', 'File Vault')
    cy.get('@menuLinks').eq(8).should('contain', 'Login History')
    cy.get('@menuLinks').eq(9).should('contain', 'Meetings')
    cy.get('@menuLinks').eq(10).should('contain', 'Goals')

    // A bit of a hack - this component loads very late, but cypress will continue loading the page between spec files.  So, the component loads (and the API call is made) during a gray area where no api stub/intercepts are active.  So, waiting for it to load forces the spec to pass.
    cy.get('app-rpm', {
      timeout: 12000
    })
    cy.wait('@getRpm')
  })
})
