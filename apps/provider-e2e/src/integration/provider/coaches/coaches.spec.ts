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

    cy.get('app-coaches').find('a').contains('Add New Coach').click()

    cy.get('mat-dialog-container')
      .find('input[data-placeholder="First Name"]')
      .type('test first name')

    cy.get('mat-dialog-container')
      .find('input[data-placeholder="Last Name"]')
      .type('test last name')

    cy.get('mat-dialog-container')
      .find('input[data-placeholder="Email"]')
      .type('test@test.com')

    cy.get('mat-dialog-container')
      .find('input[data-placeholder="Phone"]')
      .type('1111111')

    cy.get('mat-dialog-container')
      .find('input[data-placeholder="Date of Birth"]')
      .eq(1)
      .type('1/1/2000')

    cy.get('mat-dialog-container')
      .find('mat-checkbox[formControlName="sendActivationEmail"]')
      .click()

    cy.get('app-clinics-table-picker')
      .find('mat-table mat-row')
      .as('clinicRows')

    cy.get('@clinicRows').should('have.length', 12)

    cy.get('@clinicRows').eq(0).contains('CoachCare')
    cy.get('@clinicRows').eq(1).contains('Center for Medical Weight Loss')
    cy.get('@clinicRows').eq(2).contains('MDTeam')
    cy.get('@clinicRows').eq(3).contains('inHealth')
    cy.get('@clinicRows').eq(4).contains('ShiftSetGo')
    cy.get('@clinicRows').eq(5).contains('Apollo Italy')
    cy.get('@clinicRows').eq(6).contains('Apollo US')
    cy.get('@clinicRows').eq(7).contains('Conci')
    cy.get('@clinicRows').eq(8).contains('Wellcore')
    cy.get('@clinicRows').eq(9).contains('MuscleWise')
    cy.get('@clinicRows').eq(10).contains('Ideal You')
    cy.get('@clinicRows').eq(11).contains('Sharp')

    cy.get('@clinicRows').eq(0).find('button[title="Select"]').last().click()

    cy.get('mat-dialog-container')
      .find('button')
      .contains('Save New User')
      .click({ force: true })

    cy.wait('@accountPostRequest').should((xhr) => {
      expect(xhr.request.body.accountType).to.equal('2')
      expect(xhr.request.body.association.organization).to.equal('1')
      expect(xhr.request.body.association.notification).to.equal('disabled')
      expect(xhr.request.body.countryCode).to.equal('+1')
      expect(xhr.request.body.email).to.equal('test@test.com')
      expect(xhr.request.body.firstName).to.equal('test first name')
      expect(xhr.request.body.lastName).to.equal('test last name')
      expect(xhr.request.body.phone).to.equal('1111111')
      expect(xhr.request.body.preferredLocales[0]).to.equal('en')
      expect(xhr.request.body.timezone).to.equal('America/New_York')
    })
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
