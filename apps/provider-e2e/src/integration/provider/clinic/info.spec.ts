import { standardSetup } from '../../../support'

describe('Clinics -> Clinic -> Info', function () {
  it('Properly displays the Clinic Information', function () {
    standardSetup()

    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')}`)

    cy.get('app-clinic-info')
      .find('input[data-placeholder="Name"]')
      .should('have.value', 'CoachCare')

    cy.get('app-clinic-info')
      .find('input[data-placeholder="First Name"]')
      .should('have.value', 'Test Clinic')

    cy.get('app-clinic-info')
      .find('input[data-placeholder="Last Name"]')
      .should('have.value', 'Contact')

    cy.get('app-clinic-info')
      .find('input[data-placeholder="Email"]')
      .should('have.value', 'test.clinic@coachcare.com')

    cy.get('app-clinic-info')
      .find('input[data-placeholder="Phone"]')
      .should('have.value', '1878989123')

    cy.get('app-clinic-info')
      .find('input[data-placeholder="Street"]')
      .should('have.value', '122 Av')

    cy.get('app-clinic-info')
      .find('input[data-placeholder="City"]')
      .should('have.value', 'New York')

    cy.get('app-clinic-info')
      .find('input[data-placeholder="State"]')
      .should('have.value', 'TX')

    cy.get('app-clinic-info')
      .find('input[data-placeholder="Postal Code"]')
      .should('have.value', '10001')

    cy.get('app-clinic-info')
      .find('input[data-placeholder="Country"]')
      .should('have.value', 'US')
  })
})
