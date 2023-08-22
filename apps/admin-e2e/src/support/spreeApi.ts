const interceptSpreeApiCalls = (): void => {
  cy.log('Loading spree API intercept files')

  cy.intercept('GET', `api/v2/storefront/taxons?*`, {
    fixture: 'spree/taxons'
  })

  cy.intercept('GET', `api/v2/storefront/products/69?*`, {
    fixture: 'spree/productSingle'
  })

  cy.intercept('GET', `api/v2/storefront/products?*`, {
    fixture: 'spree/products'
  })

  cy.intercept('GET', 'api/v2/storefront/cart?*', {
    fixture: 'spree/cart'
  }).as('spreeGetCart')

  cy.intercept('POST', 'api/v2/storefront/account', {
    fixture: 'spree/createAccount'
  })

  cy.intercept('GET', 'api/v2/storefront/store', {
    fixture: 'spree/store'
  })

  cy.intercept('POST', 'api/v2/storefront/cart', {
    fixture: 'spree/createCart'
  }).as('spreeCallCreateCart')

  cy.intercept('POST', 'api/v2/storefront/cart/add_item', {
    fixture: 'spree/addItem'
  }).as('spreeCallAddItemToCart')

  cy.intercept('PATCH', 'api/v2/storefront/cart/set_quantity', {
    fixture: 'spree/setQuantity'
  }).as('spreeCallSetQuantity')

  cy.intercept('DELETE', 'api/v2/storefront/cart/remove_line_item/*', {
    fixture: 'spree/removeItem'
  }).as('spreeCallRemoveItem')

  cy.intercept('PATCH', 'api/v2/storefront/checkout', {
    fixture: 'spree/checkout'
  }).as('spreeCallCheckout')

  cy.intercept('GET', 'api/v2/storefront/checkout/shipping_rates', {
    fixture: 'spree/shippingRates'
  })

  cy.intercept('PATCH', 'api/v2/storefront/checkout/advance', {
    fixture: 'spree/placeOrder'
  }).as('spreeCallAdvanceOrder')

  cy.intercept('PATCH', 'api/v2/storefront/checkout/complete', {
    fixture: 'spree/placeOrder'
  }).as('spreeCallPlaceOrder')

  cy.intercept('GET', 'api/v2/storefront/stripe/subscriptions', {
    statusCode: 200,
    body: {
      data: []
    }
  })

  cy.intercept('POST', 'api/v2/storefront/checkout/create_payment', {
    fixture: 'spree/placeOrder'
  })

  cy.intercept('GET', 'api/v2/storefront/stripe/credit_cards', {
    fixture: 'spree/creditCards'
  })

  cy.intercept('GET', 'api/v2/storefront/checkout/payment_methods', {
    fixture: 'spree/paymentMethods'
  })
}

export { interceptSpreeApiCalls }
