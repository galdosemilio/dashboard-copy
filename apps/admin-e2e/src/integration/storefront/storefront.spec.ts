import { standardSetup } from '../../support'
import { interceptSpreeApiCalls } from '../../support/spreeApi'

describe('Loading Storefront page', function () {
  beforeEach(() => {
    cy.setTimezone('et')
    interceptSpreeApiCalls()
  })

  it('Redirect to login without token', function () {
    standardSetup(false)
    cy.visit(`/storefront`)
    cy.get('button').contains('Sign In').should('have.length', 1)
  })

  it('Redirect to products page with auth', function () {
    standardSetup(true)
    cy.visit(`/storefront?token=test`)
    cy.url().should('include', '/storefront/product')
  })
})
