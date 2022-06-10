import { standardSetup } from '../../support'
import { interceptSpreeApiCalls } from '../../support/spreeApi'

describe('Loading Storefront product dialog', function () {
  beforeEach(() => {
    cy.setTimezone('et')
    standardSetup(true)
    interceptSpreeApiCalls()
    cy.visit(`/storefront/order/cart?token=test`)
    cy.tick(20000)
  })

  it('should show cart items', function () {
    cy.get('.cart-item').should('have.length', 1)
  })

  it('should change qty of item', function () {
    cy.get('.cart-item').eq(0).get('.qty-wrap').find('p').contains('1')
    cy.get('.cart-item').eq(0).get('.qty-wrap').find('button').eq(1).click()

    cy.wait('@spreeCallSetQuantity').should((xhr) => {
      expect(xhr.request.url).to.contain(`api/v2/storefront/cart/set_quantity`)
      expect(xhr.response.statusCode).to.equal(200)
    })

    cy.get('.cart-item').eq(0).get('.qty-wrap').find('p').contains('2')
  })

  it('should remove item', function () {
    cy.get('.cart-item').eq(0).find('[cy-data="remove-item-button"]').click()

    cy.wait('@spreeCallRemoveItem').should((xhr) => {
      expect(xhr.request.url).to.contain(
        `api/v2/storefront/cart/remove_line_item`
      )
      expect(xhr.response.statusCode).to.equal(200)
    })
  })

  it('should goto checkout page', function () {
    cy.get('[cy-data="checkout-button"]').click()
    cy.url().should('include', '/storefront/order/checkout')
  })
})
