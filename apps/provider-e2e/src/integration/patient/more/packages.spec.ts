import { standardSetup } from './../../../support'

describe('Patient profile -> more -> phases and labels', function () {
  it('View and select packages', function () {
    standardSetup()
    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings;s=labels`)

    cy.get('app-labels-table').find('mat-row').as('packageRows')

    cy.get('@packageRows').should('have.length', 3)

    cy.get('@packageRows').eq(0).should('contain', 'Package 1')
    cy.get('@packageRows').eq(1).should('contain', 'Package 2')

    cy.route({
      method: 'POST',
      url: `/1.0/package/enrollment`,
      onRequest: (xhr) => {
        expect(xhr.request.body.account).to.contain('3')
        expect(xhr.request.body.shortcode).to.equal('3')
      },
      status: 200,
      response: {}
    })

    cy.get('@packageRows')
      .eq(2)
      .should('contain', 'Package 3')
      .find('a')
      .click()
  })

  it(`The 'unenroll' button is not disabled even if there's no direct organization association`, function () {
    standardSetup(undefined, [
      {
        url: '/2.0/access/organization?**',
        fixture: 'fixture:api/organization/getAllWithNoDirect'
      }
    ])
    cy.setOrganization('cmwl')

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings;s=labels`)

    cy.get('app-labels-table').find('mat-row').as('packageRows')

    cy.get('@packageRows')
      .eq(0)
      .find('button')
      .contains('Unenroll')
      .parent()
      .should('be.enabled')
  })
})
