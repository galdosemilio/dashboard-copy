import { standardSetup } from '../../../support'

describe('Patient profile -> More -> Addresses', function () {
  beforeEach(() => {
    standardSetup()

    cy.visit(
      `/accounts/patients/${Cypress.env('clientId')}/settings;s=addresses`
    )
  })

  it('Should show the addresses', function () {
    cy.get('mat-select').should('contain', 'Billing')
    cy.get('input[data-placeholder="Address Line 1"]').should(
      'have.value',
      'Address Line 1'
    )
    cy.get('input[data-placeholder="Address Line 2"]').should(
      'have.value',
      'Address Line 2'
    )
    cy.get('input[data-placeholder="City"]').should('have.value', 'City')
    cy.get('input[data-placeholder="State"]').should('have.value', 'State')
    cy.get('input[data-placeholder="Postal Code"]').should(
      'have.value',
      '123456'
    )
  })

  it('Allows the provider to add an address', function () {
    cy.get('ccr-account-addresses')
      .find('button')
      .contains('Add New Address')
      .click()
    cy.tick(1000)

    cy.get('mat-dialog-container')
      .find('div.mat-select-trigger')
      .eq(0)
      .click({ force: true })

    cy.get('mat-option').contains('Shipping').click({ force: true })
    cy.tick(1000)
    cy.get('.cdk-overlay-transparent-backdrop').click()

    cy.get('mat-dialog-container')
      .find('input[data-placeholder="Address Line 1"]')
      .type('Address Line 1')
    cy.get('mat-dialog-container')
      .find('input[data-placeholder="Address Line 2"]')
      .type('Address Line 2')
    cy.get('mat-dialog-container')
      .find('input[data-placeholder="City"]')
      .type('City')
    cy.get('mat-dialog-container')
      .find('input[data-placeholder="State"]')
      .type('State')
    cy.get('mat-dialog-container')
      .find('input[data-placeholder="Postal Code"]')
      .type('123456')

    cy.tick(1000)

    cy.get('button').contains('Create').click()

    cy.wait('@postAddressRequest').should((xhr) => {
      expect(xhr.request.url).to.contain('1')
      expect(xhr.request.body.address1).to.equal('Address Line 1')
      expect(xhr.request.body.address2).to.equal('Address Line 2')
      expect(xhr.request.body.city).to.equal('City')
      expect(xhr.request.body.stateProvince).to.equal('State')
      expect(xhr.request.body.postalCode).to.equal('123456')
      expect(xhr.request.body.labels[0]).to.equal('2')
    })
  })

  it('Allows the provider to add an address without inserting the second line', function () {
    cy.get('ccr-account-addresses')
      .find('button')
      .contains('Add New Address')
      .click()
    cy.tick(1000)

    cy.get('mat-dialog-container')
      .find('div.mat-select-trigger')
      .eq(0)
      .click({ force: true })

    cy.get('mat-option').contains('Shipping').click({ force: true })
    cy.tick(1000)
    cy.get('.cdk-overlay-transparent-backdrop').click()

    cy.get('mat-dialog-container')
      .find('input[data-placeholder="Address Line 1"]')
      .type('Address Line 1')
    cy.get('mat-dialog-container')
      .find('input[data-placeholder="City"]')
      .type('City')
    cy.get('mat-dialog-container')
      .find('input[data-placeholder="State"]')
      .type('State')
    cy.get('mat-dialog-container')
      .find('input[data-placeholder="Postal Code"]')
      .type('123456')

    cy.tick(1000)

    cy.get('button').contains('Create').click()

    cy.wait('@postAddressRequest').should((xhr) => {
      expect(xhr.request.url).to.contain('1')
      expect(xhr.request.body.address1).to.equal('Address Line 1')
      expect(xhr.request.body.address2).to.equal(undefined)
      expect(xhr.request.body.city).to.equal('City')
      expect(xhr.request.body.stateProvince).to.equal('State')
      expect(xhr.request.body.postalCode).to.equal('123456')
      expect(xhr.request.body.labels[0]).to.equal('2')
    })
  })

  it('Allows the provider to update an address', function () {
    cy.get('ccr-account-addresses')
    cy.tick(1000)

    cy.get('ccr-address-form')

    cy.get('input[data-placeholder="Address Line 1"]')
      .clear()
      .type('Updated Address Line 1')
    cy.get('input[data-placeholder="Address Line 2"]')
      .clear()
      .type('Updated Address Line 2')
    cy.get('input[data-placeholder="City"]').clear().type('Updated City')
    cy.get('input[data-placeholder="State"]').clear().type('Updated State')
    cy.get('input[data-placeholder="Postal Code"]').clear().type('000000')

    cy.tick(10000)

    cy.wait('@patchAddressRequest').should((xhr) => {
      expect(xhr.request.url).to.contain('1')
      expect(xhr.request.body.address1).to.equal('Updated Address Line 1')
      expect(xhr.request.body.address2).to.equal('Updated Address Line 2')
      expect(xhr.request.body.city).to.equal('Updated City')
      expect(xhr.request.body.stateProvince).to.equal('Updated State')
      expect(xhr.request.body.postalCode).to.equal('000000')
    })
  })

  it('Allows the provider to delete an address', function () {
    cy.get('ccr-account-addresses')
    cy.tick(1000)

    cy.get('ccr-address-form')

    cy.get('button').contains('Delete Address').click()

    cy.tick(1000)

    cy.get('mat-dialog-container').find('button').contains('Yes').click()

    cy.tick(1000)

    cy.wait('@deleteAddressRequest').should((xhr) => {
      expect(xhr.request.url).to.contain('1')
    })
  })
})
