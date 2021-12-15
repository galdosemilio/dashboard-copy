import { standardSetup } from '../../../support'

describe('Patient profile -> more -> submenu (cmwl)', function () {
  before(() => {
    cy.setOrganization('cmwl')
    standardSetup()
  })

  it('Correct main and sub links show', function () {
    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    // Main buttons
    cy.get('.ccr-tabs', {
      timeout: 12000
    })
      .find('a')
      .as('menuLinks')
    cy.get('@menuLinks').should('have.length', 5)
    cy.get('@menuLinks').eq(0).should('contain', 'Dashboard')
    cy.get('@menuLinks').eq(1).should('contain', 'Journal')
    cy.get('@menuLinks').eq(2).should('contain', 'Measurements')
    cy.get('@menuLinks').eq(3).should('contain', 'Messages')
    cy.get('@menuLinks').eq(4).should('contain', 'More')

    // Journal buttons
    cy.get('@menuLinks').eq(1).click()
    cy.get('.ccr-tabs-center', {
      timeout: 12000
    })
      .find('a')
      .as('subLinks')

    cy.get('@subLinks').should('have.length', 4)

    cy.get('@subLinks').eq(0).should('contain', 'Food')
    cy.get('@subLinks').eq(1).should('contain', 'Supplements')
    cy.get('@subLinks').eq(2).should('contain', 'Water')
    cy.get('@subLinks').eq(3).should('contain', 'Exercise')

    // More button
    cy.get('@menuLinks').eq(4).click()

    cy.get('@subLinks').should('have.length', 9)
    cy.get('@subLinks').eq(0).should('contain', 'Profile')
    cy.get('@subLinks').eq(1).should('contain', 'Phases')
    cy.get('@subLinks').eq(2).should('contain', 'Devices')
    cy.get('@subLinks').eq(3).should('contain', 'Communications')
    cy.get('@subLinks').eq(4).should('contain', 'Clinics')
    cy.get('@subLinks').eq(5).should('contain', 'File Vault')
    cy.get('@subLinks').eq(6).should('contain', 'Login History')
    cy.get('@subLinks').eq(7).should('contain', 'Meetings')
    cy.get('@subLinks').eq(8).should('contain', 'Goals')

    // A bit of a hack - this component loads very late, but cypress will continue loading the page between spec files.  So, the component loads (and the API call is made) during a gray area where no api stub/intercepts are active.  So, waiting for it to load forces the spec to pass.
    cy.get('app-rpm')
    cy.wait('@getRpm')
  })
})
