import { standardSetup } from './../../../support'

describe('Patient profile -> clinics', function () {
  beforeEach(() => {
    cy.setTimezone('et')
    standardSetup()
  })

  it('Clinics associations exist for patient, and show correctly', function () {
    cy.visit(
      `/accounts/patients/${Cypress.env('clientId')}/settings;s=associations`
    )

    cy.get('app-dieter-settings')
      .find('li')
      .contains('Clinics')
      .should('have.length', 1)

    cy.get('ccr-account-associations').find('mat-row').as('clinicRows')

    cy.get('@clinicRows').eq('0').should('contain', 'CoachCare')

    cy.get('@clinicRows')
      .eq('1')
      .should('contain', 'Center for Medical Weight Loss')
  })

  it('Clinics associations can be added for patient', function () {
    cy.visit(
      `/accounts/patients/${Cypress.env('clientId')}/settings;s=associations`
    )

    cy.get('ccr-account-associations')
      .find('button')
      .contains('Add Clinic Association')
      .should('have.length', 1)
      .trigger('click')
      .wait(300)

    cy.get('mat-dialog-container').find('mat-select').trigger('click').wait(300)

    cy.get('.cdk-overlay-container')
      .find('mat-option')
      .as('clinicOptions')
      .should('have.length', 8)

    cy.get('@clinicOptions').eq(0).should('contain', 'No Clinics')

    cy.get('@clinicOptions').eq(1).should('contain', 'CoachCare')

    cy.get('@clinicOptions')
      .eq(2)
      .should('contain', 'Center for Medical Weight Loss')

    cy.get('@clinicOptions').eq(3).should('contain', 'MDTeam')

    cy.get('@clinicOptions').eq(4).should('contain', 'inHealth')
  })

  it('Deletable clinics associations limited to only "admin" permissioned clinic', function () {
    cy.route(
      'GET',
      '/2.0/access/organization?**',
      'fixture:api/organization/getAll-noadmin'
    )

    cy.visit(
      `/accounts/patients/${Cypress.env('clientId')}/settings;s=associations`
    )

    cy.get('app-dieter-settings')
      .find('li')
      .contains('Clinics')
      .should('have.length', 1)

    cy.get('ccr-account-associations').find('mat-row').as('clinicRows')

    cy.get('@clinicRows')
      .eq('0')
      .find('mat-icon')
      .should('have.class', 'disabled')

    cy.get('@clinicRows')
      .eq('1')
      .find('mat-icon')
      .should('have.class', 'disabled')
  })

  it('Cannot add association if no "admin" permissioned clinics', function () {
    cy.route(
      'GET',
      '/2.0/access/organization?**',
      'fixture:api/organization/getAll-noadmin'
    )
    cy.route(
      'GET',
      '/2.0/access/organization?account=**',
      'fixture:api/general/emptyDataEmptyPagination'
    )

    cy.visit(
      `/accounts/patients/${Cypress.env('clientId')}/settings;s=associations`
    )

    cy.get('ccr-account-associations')
      .find('button')
      .should('have.attr', 'disabled')
  })
})
