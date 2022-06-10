import { standardSetup } from '../../support'
import { interceptSpreeApiCalls } from '../../support/spreeApi'

describe('Loading Storefront product page', function () {
  beforeEach(() => {
    cy.setTimezone('et')
    standardSetup(true)
    interceptSpreeApiCalls()
    cy.visit(`/storefront?token=test`)
    cy.tick(20000)
  })

  it('Show categories list', function () {
    cy.url().should('include', '/storefront/product')
    cy.get('.categories').find('.category').should('have.length', 7)
  })

  it('Show product list', function () {
    cy.url().should('include', '/storefront/product')
    cy.get('.categories').find('.category').eq(0).click()
    cy.get('.products').find('.product').should('have.length', 1)
  })

  it('Open product dialog', function () {
    cy.url().should('include', '/storefront/product')
    cy.get('.categories').find('.category').eq(0).click()
    cy.get('.products').find('.product').eq(0).click()
    cy.get('ccr-storefront-product-dialog').should('have.length', 1)
  })
})
