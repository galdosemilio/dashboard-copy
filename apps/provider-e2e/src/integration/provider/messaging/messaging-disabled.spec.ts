import { standardSetup } from './../../../support'

describe('Organization Messaging Preference', function () {
  it('Messaging is shown in menu', function () {
    cy.setOrganization('ccr')
    standardSetup()

    cy.visit('/')

    cy.get('app-menu')
      .find('app-sidenav-item')
      .not('.hidden')
      .contains('Messages')
      .should('have.length', 1)

    // Adding for Cypress issue where page continues to load after spec is done
    cy.get('app-dieters-table')
  })

  it('Messaging is hidden in menu', function () {
    cy.setOrganization('ccr')
    standardSetup()

    cy.visit('/')

    cy.intercept(
      'GET',
      '/1.0/message/preference/organization?organization=**',
      { fixture: 'api/message/getOrgPreference-disabled' }
    )

    cy.get('app-menu')
      .find('app-sidenav-item')
      .not('.hidden')
      .contains('Messages')
      .should('have.length', 0)

    // Adding for Cypress issue where page continues to load after spec is done
    cy.get('app-dieters-table')
  })
})
