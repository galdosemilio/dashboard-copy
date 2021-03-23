import { standardSetup } from '../../support'

describe('Validate permissions on coaches listing page', function () {
  it('No permissions for associated organization', function () {
    cy.setTimezone('et')
    standardSetup(undefined, [
      {
        url: '/2.0/access/organization?**',
        fixture: 'api/organization/getAll-nopermissions'
      }
    ])

    verifyTable(false)
  })

  it('Only "Admin" permission for associated organization', function () {
    cy.setTimezone('et')
    standardSetup(undefined, [
      {
        url: '/2.0/access/organization?**',
        fixture: 'api/organization/getAll-onlyadmin'
      }
    ])

    verifyTable(true)
  })

  it('Only "Client PHI" permission for associated organization', function () {
    cy.setTimezone('et')
    standardSetup(undefined, [
      {
        url: '/2.0/access/organization?**',
        fixture: 'api/organization/getAll-onlyclientphi'
      }
    ])

    verifyTable(false)
  })

  it('Only "View All" permission for associated organization', function () {
    cy.setTimezone('et')
    standardSetup(undefined, [
      {
        url: '/2.0/access/organization?**',
        fixture: 'api/organization/getAll-onlyviewall'
      }
    ])
    verifyTable(false)
  })

  it('"View All" and "Client PHI" permission for associated organization', function () {
    cy.setTimezone('et')
    standardSetup(undefined, [
      {
        url: '/2.0/access/organization?**',
        fixture: 'api/organization/getAll-noadmin'
      }
    ])

    verifyTable(false)
  })
  it('Full permissions for associated organization', function () {
    cy.setTimezone('et')
    standardSetup(undefined, [
      {
        url: '/2.0/access/organization?**',
        fixture: 'api/organization/getAll'
      }
    ])

    verifyTable(true)
  })
})

function verifyTable(hasActions: boolean) {
  cy.visit(`/accounts/coaches`)

  // These two lines are basically redundant, but cypress won't fully load the data otherwise
  cy.get('[data-cy="coach-table"]')
  cy.clock().tick(10000)

  cy.get('[data-cy="coach-table"]').find('mat-row').should('have.length', 2)

  cy.get('[data-cy="coach-table"]').should(
    hasActions ? 'not.have.class' : 'have.class',
    'notClickable'
  )

  cy.get('[data-cy="coach-table-actions"]')
    .first()
    .find('button')
    .should('have.length', hasActions ? 2 : 0)

  cy.visit(`/accounts/coaches/6`)

  cy.url().should(
    'eq',
    hasActions
      ? `${Cypress.env('baseUrl')}/accounts/coaches/6`
      : `${Cypress.env('baseUrl')}/accounts/coaches`
  )

  cy.tick(10000)

  if (!hasActions) {
    cy.get('app-coaches-table').find('mat-row').should('have.length', 2)
  } else {
    cy.get('app-coach').find('h2').should('have.length', 2)
  }
}
