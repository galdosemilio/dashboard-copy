import { standardSetup } from '../../../support'

describe('Reports > Overview > Ecommerce', function () {
  beforeEach(() => {
    cy.setTimezone('et')
    standardSetup(true)
  })

  it('Should show the billing report page', function () {
    cy.visit(`/admin/reports/overview/ecommerce`)

    cy.get('ccr-ecommerce-report').should('exist')
  })

  it('Should respect the form validity', function () {
    cy.visit(`/admin/reports/overview/ecommerce`)

    cy.get('ccr-ecommerce-report')
      .find('button')
      .contains('Download CSV')
      .parent()
      .parent()
      .should('be.disabled')
  })

  it('Should attempt to fetch the report data', function () {
    cy.visit(`/admin/reports/overview/ecommerce`)

    cy.get('ccr-ecommerce-report')
    cy.tick(10000)

    cy.get('ccr-ecommerce-report')
      .find('button')
      .contains('Download CSV')
      .parent()
      .parent()
      .should('be.enabled')
      .click({ force: true })

    cy.tick(1000)

    cy.wait('@apiCallOrganizationBilling')
  })
})
