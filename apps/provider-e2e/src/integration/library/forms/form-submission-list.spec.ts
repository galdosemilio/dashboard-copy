import { standardSetup } from '../../../support'

describe('Dashboard -> Content Library -> Forms -> Form', function () {
  it('Shows Form Submission List data in Eastern Time (New York)', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/library/forms/${Cypress.env('formId')}/submissions`)

    cy.get('app-library-form-submissions-table', { timeout: 12000 })
      .find('mat-row')
      .as('submissionRows')

    cy.get('@submissionRows').should('have.length', 3)

    cy.get('@submissionRows')
      .eq(0)
      .should('contain', 'Lascario Client Pacheco')
      .should('contain', 'Tue, Dec 31 2019')
      .should('contain', '10:44 am')
      .should('contain', 'CoachCare')

    cy.get('@submissionRows')
      .eq(1)
      .should('contain', 'Lascario Client Pacheco')
      .should('contain', 'Tue, Dec 31 2019')
      .should('contain', '6:00 pm')
      .should('contain', 'CoachCare')

    cy.get('@submissionRows')
      .eq(2)
      .should('contain', 'Lascario Client Pacheco')
      .should('contain', 'Wed, Jan 1 2020')
      .should('contain', '10:45 am')
      .should('contain', 'CoachCare')
  })

  it('Shows Form Submission List data in Eastern Time (Australia)', function () {
    cy.setTimezone('aet')
    standardSetup()

    cy.visit(`/library/forms/${Cypress.env('formId')}/submissions`)

    cy.get('app-library-form-submissions-table', { timeout: 12000 })
      .find('mat-row')
      .as('submissionRows')

    cy.get('@submissionRows').should('have.length', 3)

    cy.get('@submissionRows')
      .eq(0)
      .should('contain', 'Lascario Client Pacheco')
      .should('contain', 'Wed, Jan 1 2020')
      .should('contain', '2:44 am')
      .should('contain', 'CoachCare')

    cy.get('@submissionRows')
      .eq(1)
      .should('contain', 'Lascario Client Pacheco')
      .should('contain', 'Wed, Jan 1 2020')
      .should('contain', '10:00 am')
      .should('contain', 'CoachCare')

    cy.get('@submissionRows')
      .eq(2)
      .should('contain', 'Lascario Client Pacheco')
      .should('contain', 'Thu, Jan 2 2020')
      .should('contain', '2:45 am')
      .should('contain', 'CoachCare')
  })

  it('Shows Form Submission List: not deletable', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/library/forms/${Cypress.env('formId')}/submissions`)

    cy.get('app-library-form-submissions-table')
      .find('mat-row')
      .as('submissionRows')

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
  })

  it('Shows Form Submission List: deletable', function () {
    cy.setTimezone('et')
    standardSetup(undefined, [
      {
        url: `/1.0/content/form/${Cypress.env('formId')}?**`,
        fixture: 'fixture:/api/form/full-form-removeable'
      },
      {
        url: '/1.0/content/form/submission?**',
        fixture: 'fixture:/api/form/getListing-removeable'
      }
    ])

    cy.visit(`/library/forms/${Cypress.env('formId')}/submissions`)

    cy.get('app-library-form-submissions-table')
      .find('mat-row')
      .as('submissionRows')

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
  })
})
