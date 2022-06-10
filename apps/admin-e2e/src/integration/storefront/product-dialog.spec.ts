import { standardSetup } from '../../support'
import { interceptSpreeApiCalls } from '../../support/spreeApi'

describe('Loading Storefront product dialog', function () {
  beforeEach(() => {
    cy.setTimezone('et')
    standardSetup(true)
    interceptSpreeApiCalls()

    cy.visit(`/storefront?token=test`)
    cy.tick(20000)
    cy.get('.categories').find('.category').eq(0).click()
    cy.get('.products').find('.product').eq(0).click()
  })

  it('should not decrease qty at one', function () {
    cy.get('.qty-wrap').find('.qty').contains('1')
    cy.get('.qty-wrap').find('button').eq(0).click()
    cy.get('.qty-wrap').find('.qty').contains('1')
  })

  it('should increase qty', function () {
    cy.get('.qty-wrap').find('.qty').contains('1')
    cy.get('.qty-wrap').find('button').eq(1).click()
    cy.get('.qty-wrap').find('.qty').contains('2')
  })

  it('should decrease qty', function () {
    cy.get('.qty-wrap').find('.qty').contains('1')
    cy.get('.qty-wrap').find('button').eq(1).click()
    cy.get('.qty-wrap').find('.qty').contains('2')
    cy.get('.qty-wrap').find('button').eq(0).click()
    cy.get('.qty-wrap').find('.qty').contains('1')
  })

  it('should add item to cart', function () {
    cy.get('ccr-storefront-product-dialog').find('.ccr-button').eq(0).click()

    cy.wait('@spreeCallAddItemToCart').should((xhr) => {
      expect(xhr.request.url).to.contain(`api/v2/storefront/cart/add_item`)
      expect(xhr.response.statusCode).to.equal(200)
    })
  })
})
