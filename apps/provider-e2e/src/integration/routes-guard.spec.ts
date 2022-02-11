import { standardSetup } from '../support'

function assertRedirection() {
  cy.get('mat-sidenav-content').should('exist').wait(1000)
  cy.tick(1000)

  cy.url().should('include', '/dashboard')
}

describe('routes guard', () => {
  it('Should access provider routes in provider account', () => {
    cy.setOrganization('ccr')
    standardSetup()

    cy.visit('/accounts/patients')

    cy.get('mat-sidenav-content').should('exist').wait(1000)
    cy.tick(1000)

    cy.url().should('include', '/accounts/patients')
  })

  it('Should access patient routes in patient account', () => {
    cy.setOrganization('wellcore')
    standardSetup({ mode: 'client' })

    cy.visit('/schedule/mosaic')

    cy.get('mat-sidenav-content').should('exist').wait(1000)
    cy.tick(1000)

    cy.url().should('include', '/schedule/mosaic')
  })

  it('Should redirect to dashboard with patient route in provider account', () => {
    cy.setOrganization('wellcore')
    standardSetup()

    cy.visit('/schedule/mosaic')

    assertRedirection()
  })

  it('Should redirect to dashboard with provider route in patient account', () => {
    cy.setOrganization('ccr')
    standardSetup({ mode: 'client' })

    cy.visit('/accounts/patients')

    assertRedirection()
  })
})
