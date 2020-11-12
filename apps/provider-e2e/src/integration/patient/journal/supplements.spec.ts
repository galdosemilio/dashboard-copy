import { standardSetup } from '../../../support'

describe('Dashboard -> Patients -> Patient -> Journal -> Supplements', function () {
  it('Shows Supplement data in Eastern Time (New York)', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(
      `/accounts/patients/${Cypress.env('clientId')}/journal;s=supplements`
    )

    cy.get('app-dieter-journal-supplements-table', { timeout: 12000 })
      .find('tbody tr')
      .as('supplementRows')

    cy.get('@supplementRows').should('have.length', 7)

    cy.get('@supplementRows')
      .eq(3)
      .should('contain', 'Sat, Dec 28')
      .should('contain', '0/1')

    cy.get('@supplementRows')
      .eq(4)
      .should('contain', 'Sun, Dec 29')
      .should('contain', '1/2')
      .should('contain', '1/1')

    cy.get('@supplementRows')
      .eq(5)
      .should('contain', 'Mon, Dec 30')
      .should('contain', '1/2')
      .should('contain', '1/1')

    cy.get('@supplementRows')
      .eq(6)
      .should('contain', 'Tue, Dec 31')
      .should('contain', '1/2')
      .should('contain', '1/1')
      .should('contain', '2/2')
      .should('contain', '0/1')
  })

  it('Shows Supplement data in Eastern Time (Australia)', function () {
    cy.setTimezone('aet')
    standardSetup()

    cy.visit(
      `/accounts/patients/${Cypress.env('clientId')}/journal;s=supplements`
    )

    cy.get('app-dieter-journal-supplements-table', { timeout: 12000 })
      .find('tbody tr')
      .as('supplementRows')

    cy.get('@supplementRows').should('have.length', 7)

    cy.get('@supplementRows')
      .eq(3)
      .should('contain', 'Sat, Dec 28')
      .should('contain', '0/1')

    cy.get('@supplementRows')
      .eq(4)
      .should('contain', 'Sun, Dec 29')
      .should('contain', '1/2')
      .should('contain', '1/1')

    cy.get('@supplementRows')
      .eq(5)
      .should('contain', 'Mon, Dec 30')
      .should('contain', '1/2')
      .should('contain', '1/1')

    cy.get('@supplementRows')
      .eq(6)
      .should('contain', 'Tue, Dec 31')
      .should('contain', '1/2')
      .should('contain', '1/1')
      .should('contain', '2/2')
      .should('contain', '0/1')
  })
})
