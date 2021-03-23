import { standardSetup } from './../../support'

describe('Validate permissions on homepage', function () {
  it('No permissions for associated organization', function () {
    cy.setTimezone('et')
    standardSetup(undefined, [
      {
        url: '/2.0/access/organization?**',
        fixture: 'api/organization/getAll-nopermissions'
      }
    ])

    cy.visit('/')

    cy.get('[data-cy="view-all-alert-button"]').should('not.exist')
    cy.get('[data-cy="alert-listing"]').should(
      'contain',
      'Your account does not have permission to access this feature'
    )

    cy.get('[data-cy="view-all-patients-button"]').should('not.exist')
    cy.get('[data-cy="view-lastest-signups"]').should(
      'contain',
      'Your account does not have permission to access this feature'
    )
  })

  it('Only "View All" permission for associated organization', function () {
    cy.setTimezone('et')
    standardSetup(undefined, [
      {
        url: '/2.0/access/organization?**',
        fixture: 'api/organization/getAll-onlyviewall'
      }
    ])

    cy.visit('/')

    cy.get('[data-cy="view-all-alert-button"]').should('not.exist')
    cy.get('[data-cy="alert-listing"]').should(
      'contain',
      'Your account does not have permission to access this feature'
    )

    cy.get('[data-cy="view-all-patients-button"]').should('exist')
    cy.get('[data-cy="view-lastest-signups"]')
      .find('mat-row')
      .should('have.length', 2)

    cy.get('[data-cy="patient-listing-actions-buttons"]')
      .first()
      .find('button')
      .should('have.length', 0)
  })

  it('Only "Client PHI" permission for associated organization', function () {
    cy.setTimezone('et')
    standardSetup(undefined, [
      {
        url: '/2.0/access/organization?**',
        fixture: 'api/organization/getAll-onlyclientphi'
      }
    ])

    cy.visit('/')

    cy.get('[data-cy="view-all-alert-button"]').should('not.exist')
    cy.get('[data-cy="alert-listing"]').should(
      'contain',
      'Your account does not have permission to access this feature'
    )

    cy.get('[data-cy="view-all-patients-button"]').should('not.exist')
    cy.get('[data-cy="view-lastest-signups"]').should(
      'contain',
      'Your account does not have permission to access this feature'
    )
  })

  it('"View All" and "Client PHI" permission for associated organization', function () {
    cy.setTimezone('et')
    standardSetup(undefined, [
      {
        url: '/2.0/access/organization?**',
        fixture: 'api/organization/getAll-noadmin'
      }
    ])

    cy.visit('/')

    cy.get('[data-cy="view-all-alert-button"]').should('exist')
    cy.get('[data-cy="alert-listing"]').should('contain', 'Name')
    cy.get('[data-cy="alert-listing"]').should('contain', 'Alert Type')

    cy.get('[data-cy="view-all-patients-button"]').should('exist')
    cy.get('[data-cy="view-lastest-signups"]')
      .find('mat-row')
      .should('have.length', 2)
    cy.get('[data-cy="patient-listing-actions-buttons"]')
      .first()
      .find('button')
      .should('have.length', 2)

    cy.get('[data-cy="patient-listing-actions-button-open"]').should(
      'have.length',
      2
    )
    cy.get('[data-cy="patient-listing-actions-button-edit"]').should(
      'have.length',
      2
    )
    cy.get('[data-cy="patient-listing-actions-button-delete"]').should(
      'have.length',
      0
    )
  })

  it('Full permissions for associated organization', function () {
    cy.setTimezone('et')
    standardSetup(undefined, [
      {
        url: '/2.0/access/organization?**',
        fixture: 'api/organization/getAll'
      }
    ])

    cy.visit('/')

    cy.get('[data-cy="view-all-alert-button"]').should('exist')
    cy.get('[data-cy="alert-listing"]').should('contain', 'Name')
    cy.get('[data-cy="alert-listing"]').should('contain', 'Alert Type')

    cy.get('[data-cy="view-all-patients-button"]').should('exist')
    cy.get('[data-cy="view-lastest-signups"]')
      .find('mat-row')
      .should('have.length', 2)

    cy.get('[data-cy="patient-listing-actions-buttons"]')
      .first()
      .find('button')
      .should('have.length', 3)

    cy.get('[data-cy="patient-listing-actions-button-open"]').should(
      'have.length',
      2
    )
    cy.get('[data-cy="patient-listing-actions-button-edit"]').should(
      'have.length',
      2
    )
    cy.get('[data-cy="patient-listing-actions-button-delete"]').should(
      'have.length',
      2
    )
  })
})
