import { standardSetup } from './../../../support'

describe('Patient profile -> association message', function () {
  afterEach(() => {
    cy.wait(3000)
  })

  it('Association message is not shown', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    cy.get('.ccr-dashboard').find('ccr-stat-diff').as('summaryBoxes')

    cy.get('[data-cy="patientAssociationMessage"]').should('not.exist')

    cy.get('@summaryBoxes').should('have.length', 5)
  })

  it('Association message is shown', function () {
    cy.setTimezone('et')
    standardSetup({
      apiOverrides: [
        {
          url: '/2.0/access/account?**',
          fixture: 'api/access/getAccountAccessCmwlClinic'
        }
      ]
    })

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    cy.get('.ccr-dashboard').find('ccr-stat-diff').as('summaryBoxes')

    cy.get('[data-cy="patientAssociationMessage"]')
      .should('exist')
      .contains(
        'This patient is not associated to the selected clinic. Some features or settings may not display correctly'
      )
  })
})
