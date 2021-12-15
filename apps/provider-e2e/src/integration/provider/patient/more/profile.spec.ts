import { standardSetup } from './../../../../support'

describe('Patient profile -> more -> profile', function () {
  it('Start Date is not affected by timezone (ET)', function () {
    cy.setTimezone('et')
    standardSetup()
    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings;s=profile`)

    cy.get('[data-placeholder="Start Date"]')
      .eq(0)
      .should('have.value', '06/21/2019')
    cy.get('[data-placeholder="Start Date"]')
      .eq(1)
      .should('have.value', 'Jun 21, 2019')
    cy.wait(3000)
  })

  it('Start Date is not affected by timezone (AET)', function () {
    cy.setTimezone('aet')
    standardSetup()
    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings;s=profile`)

    cy.get('[data-placeholder="Start Date"]')
      .eq(0)
      .should('have.value', '06/21/2019')
    cy.get('[data-placeholder="Start Date"]')
      .eq(1)
      .should('have.value', 'Jun 21, 2019')
    cy.wait(3000)
  })

  it('Shows the underage client warning', function () {
    cy.setTimezone('aet')
    standardSetup()
    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings;s=profile`)

    cy.wait(10000)

    cy.get('[data-placeholder="Date of Birth"]').eq(1).click({ force: true })

    cy.tick(1000)

    cy.get('[data-placeholder="Date of Birth MM/DD/YYYY"]')
      .eq(0)
      .type('06/21/2019')
      .trigger('blur', { force: true })

    cy.tick(1000)

    cy.get('span').contains('I understand that this account')
  })
})
