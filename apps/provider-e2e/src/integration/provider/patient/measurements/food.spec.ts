import { standardSetup } from '../../../../support'

describe('Patient profile -> measurements -> food', function () {
  it('Show correct values in', function () {
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/measurements`)

    cy.get('app-dieter-measurements-tabs').find('li').should('have.length', 4)

    cy.get('app-dieter-measurements-tabs').find('li').contains('Food').click()

    cy.tick(1000)

    cy.get('table').find('tbody tr').as('tableRows')

    cy.clock().tick(100000)

    cy.get('@tableRows').should('have.length', 7)

    cy.get('@tableRows').eq(0).should('contain', 'Dec 25')
    cy.get('@tableRows').eq(1).should('contain', 'Dec 26')
    cy.get('@tableRows').eq(2).should('contain', 'Dec 27')
    cy.get('@tableRows').eq(3).should('contain', 'Dec 28')
    cy.get('@tableRows').eq(4).should('contain', 'Dec 29')
    cy.get('@tableRows').eq(5).should('contain', 'Dec 30')
    cy.get('@tableRows').eq(6).should('contain', 'Dec 31')

    cy.get('@tableRows').eq(4).should('contain', '100').should('contain', '10g')

    cy.get('@tableRows').eq(6).should('contain', '300').should('contain', '30g')
  })
})
