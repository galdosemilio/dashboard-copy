import { standardSetup } from '../../../support'

describe('Dashboard -> Coach Listing', function () {
  it('Show Coach listing in Eastern Time (New York)', function () {
    cy.setTimezone('et')

    loadsCorrectTimezone('January 1, 2019')
  })

  it('Show Coach listing in Eastern Time (Australia)', function () {
    cy.setTimezone('aet')

    loadsCorrectTimezone('January 2, 2019')
  })

  it('Add new coach has correct fields', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/accounts/coaches`)

    cy.get('app-coaches').find('a').contains('Add New Coach').trigger('click')

    cy.get('mat-dialog-container')
      .find('input[data-placeholder="First Name"]')
      .should('have.length', 1)

    cy.get('mat-dialog-container')
      .find('input[data-placeholder="Last Name"]')
      .should('have.length', 1)

    cy.get('mat-dialog-container')
      .find('input[data-placeholder="Email"]')
      .should('have.length', 1)

    cy.get('mat-dialog-container')
      .find('input[data-placeholder="Phone"]')
      .should('have.length', 1)

    cy.get('app-clinics-table-picker')
      .find('mat-table mat-row')
      .as('clinicRows')

    cy.get('@clinicRows').should('have.length', 11)

    cy.get('@clinicRows').eq(0).contains('CoachCare')
    cy.get('@clinicRows').eq(1).contains('Center for Medical Weight Loss')
    cy.get('@clinicRows').eq(2).contains('MDTeam')
    cy.get('@clinicRows').eq(3).contains('inHealth')
    cy.get('@clinicRows').eq(4).contains('ShiftSetGo')
    cy.get('@clinicRows').eq(5).contains('Apollo Italy')
    cy.get('@clinicRows').eq(6).contains('Apollo US')
    cy.get('@clinicRows').eq(7).contains('Wellcore')
    cy.get('@clinicRows').eq(8).contains('MuscleWise')
    cy.get('@clinicRows').eq(9).contains('Ideal You')
  })
})

function loadsCorrectTimezone(date) {
  standardSetup()

  cy.visit(`/accounts/coaches`)

  cy.get('app-coaches-table', { timeout: 12000 }).as('coachTable')

  cy.tick(2000)

  cy.get('@coachTable').find('mat-row').as('coachRows')

  cy.get('@coachRows').should('have.length', 3)

  cy.get('@coachRows')
    .eq(0)
    .should('contain', 'Eric')
    .should('contain', 'Di Bari')
    .should('contain', 'eric@websprout.org')
    .should('contain', date)

  cy.get('@coachRows')
    .eq(2)
    .should('contain', 'Eric')
    .should('contain', 'Di Bari')
    .should('contain', 'eric.dibari@gmail.com')
    .should('contain', date)
}
