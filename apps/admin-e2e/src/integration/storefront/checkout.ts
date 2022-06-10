import { standardSetup } from '../../support'
import { interceptSpreeApiCalls } from '../../support/spreeApi'

describe('Loading Storefront product dialog', function () {
  beforeEach(() => {
    cy.setTimezone('et')
    standardSetup(true)
    interceptSpreeApiCalls()
    cy.visit(`/storefront/order/checkout?token=test`)
    cy.tick(20000)
  })

  it('should load checkout page', function () {
    cy.get('.cart-items-wrap').find('.cart-item').should('have.length', 1)

    cy.get('[cy-data="shipping-address"]')
      .find('[cy-data="shipping-address-name"]')
      .contains('Admin Coachcare')
    cy.get('[cy-data="shipping-address"]')
      .find('[cy-data="shipping-address-street"]')
      .contains('250 King St')
    cy.get('[cy-data="shipping-address"]')
      .find('[cy-data="shipping-address-city-state"]')
      .contains('San Francisco, CA 94107')

    cy.get('[cy-data="shipping-method"]').contains('Free shipping - $0.00')

    cy.get('[cy-data="payment-method"]')
      .find('[cy-data="payment-method-name"]')
      .contains('Zhang Xin')
    cy.get('[cy-data="payment-method"]')
      .find('[cy-data="payment-method-card-number"]')
      .contains('***4242')
    cy.get('[cy-data="payment-method"]')
      .find('[cy-data="payment-method-card-expires"]')
      .contains('4 / 2024')

    cy.get('[cy-data="billing-address"]')
      .find('[cy-data="billing-address-name"]')
      .contains('Admin Coachcare')
    cy.get('[cy-data="billing-address"]')
      .find('[cy-data="billing-address-street"]')
      .contains('4200 Leeland St')
    cy.get('[cy-data="billing-address"]')
      .find('[cy-data="billing-address-city-state"]')
      .contains('Houston, TX 77023')
  })

  it('should go to cart page', function () {
    cy.get('[cy-data="cart-items"]').find('button').click()
    cy.url().should('include', '/storefront/order/cart')
  })

  it('should update shipping address', function () {
    cy.get('[cy-data="shipping-address"]').find('button').click()

    cy.get('ccr-storefront-address-dialog').should('have.length', 1)
    cy.get('input[data-placeholder="Address Line 2"]').type('#12')

    cy.get('mat-dialog-actions').find('.ccr-button').eq(0).click()

    cy.wait('@apiCallUpdateAddress').should((xhr) => {
      expect(xhr.request.url).to.contain(`1.0/account`)
      expect(xhr.response.statusCode).to.equal(204)
    })
  })

  it('should update billing address', function () {
    cy.get('[cy-data="billing-address"]').find('button').click()

    cy.get('ccr-storefront-address-dialog').should('have.length', 1)
    cy.get('input[data-placeholder="Address Line 2"]').type('#12')

    cy.get('mat-dialog-actions').find('.ccr-button').eq(0).click()

    cy.wait('@apiCallUpdateAddress').should((xhr) => {
      expect(xhr.request.url).to.contain(`1.0/account`)
      expect(xhr.response.statusCode).to.equal(204)
    })
  })

  it('should place an order', function () {
    cy.get('[cy-data="place-button"]').click()

    cy.wait('@spreeCallPlaceOrder').should((xhr) => {
      expect(xhr.request.url).to.contain(`api/v2/storefront/checkout/complete`)
      expect(xhr.response.statusCode).to.equal(200)
    })

    cy.url().should('include', '/storefront/order/complete')
    cy.get('h2').contains('Thank you for your order!')
  })
})
