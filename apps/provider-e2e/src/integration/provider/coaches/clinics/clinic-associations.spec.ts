import { standardSetup } from './../../../../support'

describe('Coach profile', function () {
  beforeEach(() => {
    cy.setTimezone('et')
    standardSetup()
  })

  it('Clinics associations exist for coach, and show correctly', function () {
    cy.visit(`/accounts/coaches/${Cypress.env('providerIdOther')};s=clinics`)

    cy.get('ccr-account-associations').find('mat-row').as('clinicRows')

    cy.get('@clinicRows').eq(0).should('contain', 'CoachCare')

    cy.get('@clinicRows')
      .eq(1)
      .should('contain', 'Center for Medical Weight Loss')
  })

  it('Clinics associations can be added for coach', function () {
    cy.visit(`/accounts/coaches/${Cypress.env('providerIdOther')};s=clinics`)

    cy.get('ccr-account-associations')
      .find('button')
      .contains('Add Clinic Association')
      .should('have.length', 1)
      .trigger('click')
      .wait(300)

    cy.get('mat-dialog-container').find('mat-select').trigger('click').wait(300)

    cy.get('.cdk-overlay-container').find('mat-option').as('clinicOptions')

    cy.get('@clinicOptions').eq(0).should('contain', 'No Clinics')

    cy.get('@clinicOptions').eq(1).should('contain', 'CoachCare')

    cy.get('@clinicOptions')
      .eq(2)
      .should('contain', 'Center for Medical Weight Loss')

    cy.get('@clinicOptions').eq(3).should('contain', 'MDTeam')

    cy.get('@clinicOptions').eq(4).should('contain', 'inHealth')
  })
})
