import { standardSetup } from '../../support'

describe('Patient profile -> more -> submenu (mdteam)', function () {
  before(() => {
    cy.setOrganization('mdteam')
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

    // Journal buttons
    cy.get('@menuLinks').eq(1).click()
    cy.get('.ccr-tabs-center', {
      timeout: 12000
    })
      .find('a')
      .as('subLinks')

    cy.get('@subLinks').should('have.length', 5)

    cy.get('@subLinks').eq(0).should('contain', 'Food')
    cy.get('@subLinks').eq(1).should('contain', 'Supplements')
    cy.get('@subLinks').eq(2).should('contain', 'Water')
    cy.get('@subLinks').eq(3).should('contain', 'Exercise')
    cy.get('@subLinks').eq(4).should('contain', 'Metrics')

    // A bit of a hack - this component loads very late, but cypress will continue loading the page between spec files.  So, the component loads (and the API call is made) during a gray area where no api stub/intercepts are active.  So, waiting for it to load forces the spec to pass.
    cy.get('app-rpm')
    cy.wait('@getRpm')
  })
})
