import { standardSetup } from '../../support'

describe('Validate permissions on patient listing page', function () {
  it('No permissions for associated organization: no patient listing', function () {
    cy.setTimezone('et')
    standardSetup(undefined, [
      {
        url: '/2.0/access/organization?**',
        fixture: 'fixture:/api/organization/getAll-nopermissions'
      }
    ])
    cy.visit(`/accounts/patients`)
    cy.url().should('eq', `${Cypress.env('baseUrl')}/accounts/patients/nophi`)
    cy.get('dieter-listing-no-phi').should(
      'contain',
      'Your account does not have permission to access this feature'
    )
  })
  it('No permissions for associated organization: direct access to /accounts/patients/nophi page', function () {
    cy.setTimezone('et')
    standardSetup(undefined, [
      {
        url: '/2.0/access/organization?**',
        fixture: 'fixture:/api/organization/getAll-nopermissions'
      }
    ])
    cy.visit(`/accounts/patients/nophi`)
    cy.url().should('eq', `${Cypress.env('baseUrl')}/accounts/patients/nophi`)

    cy.get('dieter-listing-no-phi').should('exist')
  })

  it('Only "Admin" permission for associated organization: no access to patient listing', function () {
    cy.setTimezone('et')
    standardSetup(undefined, [
      {
        url: '/2.0/access/organization?**',
        fixture: 'fixture:/api/organization/getAll-onlyadmin'
      }
    ])
    cy.visit(`/accounts/patients`)
    cy.url().should('eq', `${Cypress.env('baseUrl')}/accounts/patients/nophi`)

    cy.get('dieter-listing-no-phi').should(
      'contain',
      'Your account does not have permission to access this feature'
    )
  })
  it('Only "Admin" permission for associated organization: direct access to /accounts/patients/nophi page', function () {
    cy.setTimezone('et')
    standardSetup(undefined, [
      {
        url: '/2.0/access/organization?**',
        fixture: 'fixture:/api/organization/getAll-onlyadmin'
      }
    ])
    cy.visit(`/accounts/patients/nophi`)
    cy.url().should('eq', `${Cypress.env('baseUrl')}/accounts/patients/nophi`)

    cy.get('dieter-listing-no-phi').should('exist')
  })

  it('Only "Client PHI" permission for associated organization: no access to patient listing', function () {
    cy.setTimezone('et')
    standardSetup(undefined, [
      {
        url: '/2.0/access/organization?**',
        fixture: 'fixture:/api/organization/getAll-onlyclientphi'
      }
    ])
    cy.visit(`/accounts/patients`)
    cy.url().should('eq', `${Cypress.env('baseUrl')}/accounts/patients/nophi`)

    cy.get('dieter-listing-no-phi').should(
      'contain',
      'Your account does not have permission to access this feature'
    )
  })

  it('Only "Client PHI" permission for associated organization: direct access to /accounts/patients/nophi page', function () {
    cy.setTimezone('et')
    standardSetup(undefined, [
      {
        url: '/2.0/access/organization?**',
        fixture: 'fixture:/api/organization/getAll-onlyclientphi'
      }
    ])
    cy.visit(`/accounts/patients/nophi`)
    cy.url().should('eq', `${Cypress.env('baseUrl')}/accounts/patients/nophi`)

    cy.get('dieter-listing-no-phi').should('exist')
  })

  it('Only "View All" permission for associated organization: simple patient listing', function () {
    cy.setTimezone('et')
    standardSetup(undefined, [
      {
        url: '/2.0/access/organization?**',
        fixture: 'fixture:/api/organization/getAll-onlyviewall'
      }
    ])
    cy.visit(`/accounts/patients`)
    cy.url().should('eq', `${Cypress.env('baseUrl')}/accounts/patients/nophi`)

    cy.clock().tick(10000)

    cy.get('dieter-listing-no-phi').should('be.visible')

    cy.clock().tick(10000)

    cy.get('dieter-listing-no-phi').find('mat-row').should('have.length', 2)

    cy.get('[data-cy="patient-listing-actions-buttons"]')
      .first()
      .find('button')
      .should('have.length', 0)
  })

  it('Only "View All" permission for associated organization: can access /accounts/patients/nophi page directly', function () {
    cy.setTimezone('et')
    standardSetup(undefined, [
      {
        url: '/2.0/access/organization?**',
        fixture: 'fixture:/api/organization/getAll-onlyviewall'
      }
    ])
    cy.visit(`/accounts/patients/nophi`)
    cy.url().should('eq', `${Cypress.env('baseUrl')}/accounts/patients/nophi`)

    cy.get('dieter-listing-no-phi').should('exist')
  })

  it('"View All" and "Client PHI" permission for associated organization', function () {
    cy.setTimezone('et')
    standardSetup(undefined, [
      {
        url: '/2.0/access/organization?**',
        fixture: 'fixture:/api/organization/getAll-noadmin'
      }
    ])
    cy.visit(`/accounts/patients`)
    cy.url().should('eq', `${Cypress.env('baseUrl')}/accounts/patients`)

    cy.get('[data-cy="new-patient-button"]').should('not.be.visible')

    cy.clock().tick(10000)

    cy.get('app-dieters-expandable-table').should('be.visible')

    cy.get('[data-cy="download-csv-button"]')
      .should('be.visible')
      .should('contain', 'Export CSV')

    cy.clock().tick(10000)

    cy.get('app-dieters-expandable-table')
      .find('tbody')
      .find('mat-row:visible')
      .should('have.length', 10)
  })
  it('"View All" and "Client PHI" permission for associated organization: can not access nophi page', function () {
    cy.setTimezone('et')
    standardSetup(undefined, [
      {
        url: '/2.0/access/organization?**',
        fixture: 'fixture:/api/organization/getAll-noadmin'
      }
    ])
    cy.visit(`/accounts/patients/nophi`)
    cy.url().should('eq', `${Cypress.env('baseUrl')}/accounts/patients`)

    cy.clock().tick(10000)

    cy.get('app-dieters-expandable-table').should('be.visible')
  })
  it('Full permissions for associated organization', function () {
    cy.setTimezone('et')
    standardSetup(undefined, [
      {
        url: '/2.0/access/organization?**',
        fixture: 'fixture:/api/organization/getAll'
      }
    ])
    cy.visit(`/accounts/patients`)
    cy.url().should('eq', `${Cypress.env('baseUrl')}/accounts/patients`)

    cy.clock().tick(10000)

    cy.get('app-dieters-expandable-table').should('be.visible')
    cy.get('[data-cy="new-patient-button"]').should('be.visible')
    cy.get('[data-cy="download-csv-button"]')
      .should('be.visible')
      .should('contain', 'Export CSV')

    cy.clock().tick(10000)

    cy.get('app-dieters-expandable-table')
      .find('tbody')
      .find('mat-row:visible')
      .should('have.length', 10)
  })
  it('Full permissions for associated organization: can not access nophi page', function () {
    cy.setTimezone('et')
    standardSetup(undefined, [
      {
        url: '/2.0/access/organization?**',
        fixture: 'fixture:/api/organization/getAll'
      }
    ])
    cy.visit(`/accounts/patients/nophi`)
    cy.url().should('eq', `${Cypress.env('baseUrl')}/accounts/patients`)

    cy.clock().tick(10000)

    cy.get('app-dieters-expandable-table').should('be.visible')
  })
})
