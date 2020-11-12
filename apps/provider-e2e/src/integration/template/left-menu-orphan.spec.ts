import { standardSetup } from './../../support'

describe('Lefthand menu (orphaned provider)', function () {
  it('Links should be visible (org access)', function () {
    cy.setOrganization('ccr')
    standardSetup()
    cy.visit('/')

    cy.get('app-menu')
      .find('app-sidenav-item')
      .not('.hidden')
      .should('have.length', 24)

    cy.get('[data-cy="empty-menu"]').should('not.exist')

    // Adding for Cypress issue where page continues to load after spec is done
    cy.get('app-dieters-table')
  })

  it('No links should be visible (no org access)', function () {
    cy.setOrganization('ccr')
    standardSetup()
    cy.route(
      'GET',
      '/2.0/access/organization?**',
      'fixture:/api/general/emptyDataEmptyPagination'
    )

    cy.visit('/')
    cy.get('[data-cy="empty-menu"]').should('exist')

    // Adding for Cypress issue where page continues to load after spec is done
    cy.get('ccr-form-field-lang').should('have.length', 1)
  })
})
