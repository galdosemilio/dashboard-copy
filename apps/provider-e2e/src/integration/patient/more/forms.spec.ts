import { standardSetup } from '../../../support'

describe('Dashboard -> Patients -> Patient -> More -> Forms', function () {
  it('Shows Form Submission data in Eastern Time (New York)', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings;s=forms`)

    cy.get('mat-table', { timeout: 12000 }).find('mat-row').as('submissionRows')

    cy.get('@submissionRows').should('have.length', 3)

    cy.get('@submissionRows')
      .eq(0)
      .should('contain', 'Test Submission')
      .should('contain', 'Tue, Dec 31 2019')
      .should('contain', '10:44 am')
      .should('contain', 'CoachCare')

    cy.get('@submissionRows')
      .eq(1)
      .should('contain', 'Test Submission')
      .should('contain', 'Tue, Dec 31 2019')
      .should('contain', '6:00 pm')
      .should('contain', 'CoachCare')

    cy.get('@submissionRows')
      .eq(2)
      .should('contain', 'Test Submission')
      .should('contain', 'Wed, Jan 1 2020')
      .should('contain', '10:45 am')
      .should('contain', 'CoachCare')

    cy.wait(3000)
  })

  it('Shows Form Submission data in Eastern Time (Australia)', function () {
    cy.setTimezone('aet')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings;s=forms`)

    cy.get('mat-table', { timeout: 12000 }).find('mat-row').as('submissionRows')

    cy.get('@submissionRows').should('have.length', 3)

    cy.get('@submissionRows')
      .eq(0)
      .should('contain', 'Test Submission')
      .should('contain', 'Wed, Jan 1 2020')
      .should('contain', '2:44 am')
      .should('contain', 'CoachCare')

    cy.get('@submissionRows')
      .eq(1)
      .should('contain', 'Test Submission')
      .should('contain', 'Wed, Jan 1 2020')
      .should('contain', '10:00 am')
      .should('contain', 'CoachCare')

    cy.get('@submissionRows')
      .eq(2)
      .should('contain', 'Test Submission')
      .should('contain', 'Thu, Jan 2 2020')
      .should('contain', '2:45 am')
      .should('contain', 'CoachCare')

    cy.wait(3000)
  })

  it('Shows Form Submission List: not deletable', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings;s=forms`)

    cy.get('mat-table').find('mat-row').as('submissionRows')

    cy.get('@submissionRows').should('have.length', 3)

    cy.get('@submissionRows')
      .eq(0)
      .find('[data-cy="form-submission-listing-open"]')
      .should('have.length', 1)

    cy.get('@submissionRows')
      .eq(0)
      .find('[data-cy="form-submission-listing-delete"]')
      .should('have.length', 0)

    cy.get('@submissionRows')
      .eq(1)
      .find('[data-cy="form-submission-listing-open"]')
      .should('have.length', 1)

    cy.get('@submissionRows')
      .eq(1)
      .find('[data-cy="form-submission-listing-delete"]')
      .should('have.length', 0)

    cy.get('@submissionRows')
      .eq(2)
      .find('[data-cy="form-submission-listing-open"]')
      .should('have.length', 1)

    cy.get('@submissionRows')
      .eq(2)
      .find('[data-cy="form-submission-listing-delete"]')
      .should('have.length', 0)

    cy.wait(3000)
  })

  it('Shows Form Submission List: deletable', function () {
    cy.setTimezone('et')
    standardSetup(undefined, [
      {
        url: `/1.0/content/form/${Cypress.env('formId')}?**`,
        fixture: 'api/form/full-form-removeable'
      },
      {
        url: '/1.0/content/form/submission?**',
        fixture: 'api/form/getListing-removeable'
      }
    ])

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings;s=forms`)

    cy.get('mat-table').find('mat-row').as('submissionRows')

    cy.get('@submissionRows').should('have.length', 3)

    cy.get('@submissionRows')
      .eq(0)
      .find('[data-cy="form-submission-listing-open"]')
      .should('have.length', 1)

    cy.get('@submissionRows')
      .eq(0)
      .find('[data-cy="form-submission-listing-delete"]')
      .should('have.length', 1)

    cy.get('@submissionRows')
      .eq(1)
      .find('[data-cy="form-submission-listing-open"]')
      .should('have.length', 1)

    cy.get('@submissionRows')
      .eq(1)
      .find('[data-cy="form-submission-listing-delete"]')
      .should('have.length', 1)

    cy.get('@submissionRows')
      .eq(2)
      .find('[data-cy="form-submission-listing-open"]')
      .should('have.length', 1)

    cy.get('@submissionRows')
      .eq(2)
      .find('[data-cy="form-submission-listing-delete"]')
      .should('have.length', 1)

    cy.wait(3000)
  })
})
