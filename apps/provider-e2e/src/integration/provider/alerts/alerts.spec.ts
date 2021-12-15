import { standardSetup } from '../../../support'

function assertDefaultAlerts(): void {
  cy.get('@alertTitles').eq(0).should('contain', 'Weight Regain')
  cy.get('@alertTitles').eq(1).should('contain', 'Meal Inactivity')
  cy.get('@alertTitles').eq(2).should('contain', 'Scale Inactivity')
  cy.get('@alertTitles').eq(3).should('contain', 'Tracker Inactivity')
  cy.get('@alertTitles').eq(4).should('contain', 'Weight Threshold')
}

describe('Dashboard -> Alerts', function () {
  it('Five alerts exist for CoachCare org', function () {
    cy.setOrganization('ccr')
    standardSetup()
    cy.visit(`/alerts/settings`)

    cy.get('[data-cy="alert-title"]').as('alertTitles')

    cy.get('@alertTitles').should('have.length', 11)
    assertDefaultAlerts()
  })

  it('Five alerts exist for CMWL org', function () {
    cy.setOrganization('cmwl')
    standardSetup()
    cy.visit(`/alerts/settings`)

    cy.get('[data-cy="alert-title"]').as('alertTitles')

    cy.get('@alertTitles').should('have.length', 11)
    assertDefaultAlerts()
  })

  it('Five alerts exist for inHealth org', function () {
    cy.setOrganization('inhealth')
    standardSetup()
    cy.visit(`/alerts/settings`)

    cy.get('[data-cy="alert-title"]').as('alertTitles')

    cy.get('@alertTitles').should('have.length', 11)
    assertDefaultAlerts()
  })

  it('Five alerts exist for MDTeam org', function () {
    cy.setOrganization('mdteam')
    standardSetup()
    cy.visit(`/alerts/settings`)

    cy.get('[data-cy="alert-title"]').as('alertTitles')

    cy.get('@alertTitles').should('have.length', 11)
    assertDefaultAlerts()
  })
})
