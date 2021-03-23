import { standardSetup } from './../../support'

describe('Ensure orphaned account can not access any page but "profile"', function () {
  it('Orphaned Provider cannot access hompage', function () {
    access(true, '/')
  })
  it('Orphaned Provider cannot access messages', function () {
    access(true, '/messages')
  })
  it('Orphaned Provider cannot access patient listing', function () {
    access(true, '/accounts/patients')
  })
})

function access(isOrphaned: boolean, url: string): void {
  cy.setOrganization('ccr')
  standardSetup()
  if (isOrphaned) {
    cy.intercept('GET', '/2.0/access/organization?**', {
      fixture: 'api/general/emptyDataEmptyPagination'
    })
  }
  cy.visit(url)

  cy.url().should('eq', `${Cypress.env('baseUrl')}/profile`)
  // Adding for Cypress issue where page continues to load after spec is done
  cy.get('ccr-form-field-lang').should('have.length', 1)
}
