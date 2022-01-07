import { standardSetup } from './../../../../support'

describe('Reports -> RPM -> RPM Billing', function () {
  it('Table shows RPM billing data with proper names: no pagination', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/reports/rpm/billing`)

    cy.tick(100)

    cy.get('mat-table', { timeout: 10000 }).find('mat-row').as('rpmBillingRows')

    cy.get('@rpmBillingRows').should('have.length', 5)

    cy.get('@rpmBillingRows')
      .eq(4)
      .should('contain', 'Eric')
      .should('contain', 'Di Bari')

    cy.get('@rpmBillingRows')
      .eq(4)
      .find('mat-cell')
      .eq(7)
      .should('contain', '1')

    cy.get('@rpmBillingRows')
      .eq(3)
      .should('contain', 'Lascario Client')
      .should('contain', 'Pacheco')

    cy.get('@rpmBillingRows')
      .eq(3)
      .find('mat-cell')
      .eq(7)
      .should('contain', '20m')
      .should('contain', '1')

    cy.get('ccr-paginator')
      .find('button[aria-label="Previous page"][disabled="true"]')
      .should('have.length', 1)

    cy.get('ccr-paginator')
      .find('button[aria-label="Next page"][disabled="true"]')
      .should('have.length', 1)
  })

  it('Table shows RPM billing data with proper names: next pagination', function () {
    cy.setTimezone('et')
    standardSetup({
      apiOverrides: [
        {
          url: '/3.0/warehouse/rpm/state/billing-summary?**',
          fixture: 'api/warehouse/getRPMBillingPagination'
        }
      ]
    })

    cy.visit(`/reports/rpm/billing`)

    cy.tick(100)
    cy.get('mat-table', { timeout: 10000 }).find('mat-row').as('rpmBillingRows')

    cy.get('@rpmBillingRows').should('have.length', 5)

    cy.get('@rpmBillingRows')
      .eq(4)
      .should('contain', 'Eric')
      .should('contain', 'Di Bari')

    cy.get('@rpmBillingRows')
      .eq(4)
      .find('mat-cell')
      .eq(7)
      .should('contain', '1')

    cy.get('@rpmBillingRows')
      .eq(3)
      .should('contain', 'Lascario Client')
      .should('contain', 'Pacheco')

    cy.get('@rpmBillingRows')
      .eq(3)
      .find('mat-cell')
      .eq(7)
      .should('contain', '20m')
      .should('contain', '1')

    cy.tick(1000)

    cy.get('ccr-paginator')
      .find('button[aria-label="Previous page"][disabled="true"]')
      .should('have.length', 1)

    cy.get('ccr-paginator')
      .find('button[aria-label="Next page"][disabled="true"]')
      .should('have.length', 0)

    cy.get('ccr-paginator')
      .find('button[aria-label="Next page"]')
      .should('have.length', 1)
  })

  it('A row with code requirements shows the proper icon', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/reports/rpm/billing`)

    cy.tick(100)
    cy.get('mat-table', { timeout: 10000 }).find('mat-row').as('rpmBillingRows')

    cy.get('@rpmBillingRows').should('have.length', 5)

    cy.get('@rpmBillingRows')
      .eq(1)
      .find('mat-cell')
      .eq(7)
      .find('table')
      .eq(3)
      .find('tr')
      .should('contain', '99457')
  })

  it('Shows the total count underneath the title', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/reports/rpm/billing`)

    cy.tick(100)
    cy.get('mat-table', { timeout: 10000 }).find('mat-row').as('rpmBillingRows')

    cy.get('app-reports-rpm-billing').find('h3').should('contain', '5 Patients')
  })

  it('It properly generates the CSV report with no "next" data', function () {
    cy.setTimezone('et')
    standardSetup({
      apiOverrides: [
        {
          url: '/3.0/warehouse/rpm/state/billing-summary?**',
          fixture: 'api/warehouse/getRPMBillingComplete'
        }
      ]
    })

    cy.visit(`/reports/rpm/billing`)

    cy.tick(100)
    cy.get('mat-table', { timeout: 10000 }).find('mat-row')

    cy.get('app-reports-rpm-billing')
      .find('button')
      .contains('Export Report')
      .click({ force: true })

    cy.get('snack-bar-container').should('not.exist')
  })

  it('It properly generates the CSV report with the patient on 99457', function () {
    cy.setTimezone('et')
    standardSetup({
      apiOverrides: [
        {
          url: '/3.0/warehouse/rpm/state/billing-summary?**',
          fixture: 'api/warehouse/getRPMBillingOn99457'
        }
      ]
    })

    cy.visit(`/reports/rpm/billing`)

    cy.tick(100)
    cy.get('mat-table', { timeout: 10000 }).find('mat-row')

    cy.get('app-reports-rpm-billing')
      .find('button')
      .contains('Export Report')
      .click({ force: true })

    cy.get('snack-bar-container').should('not.exist')
  })

  it('It properly generates the CSV report with the patient on 99458', function () {
    cy.setTimezone('et')
    standardSetup({
      apiOverrides: [
        {
          url: '/3.0/warehouse/rpm/state/billing-summary?**',
          fixture: 'api/warehouse/getRPMBillingOn99458'
        }
      ]
    })

    cy.visit(`/reports/rpm/billing`)

    cy.tick(100)
    cy.get('mat-table', { timeout: 10000 }).find('mat-row')

    cy.get('app-reports-rpm-billing')
      .find('button')
      .contains('Export Report')
      .click({ force: true })

    cy.get('snack-bar-container').should('not.exist')
  })

  it('It properly fetches the RPM billing without organization', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/reports/rpm/billing`)

    cy.wait('@billingSummaryGetRequest').should((xhr) => {
      expect(xhr.request.url).to.not.contain('organization')
    })
  })
})