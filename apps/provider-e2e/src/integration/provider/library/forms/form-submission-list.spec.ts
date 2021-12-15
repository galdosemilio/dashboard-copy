import { standardSetup } from '../../../../support'
import { assertTableRow } from '../../../helpers'

describe('Dashboard -> Content Library -> Forms -> Form', function () {
  it('Shows Form Submission List data in Eastern Time (New York)', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/library/forms/${Cypress.env('formId')}/submissions`)

    cy.get('app-library-form-submissions-table', { timeout: 12000 })
      .find('mat-row')
      .as('submissionRows')

    cy.get('@submissionRows').should('have.length', 3)

    assertTableRow(cy.get('@submissionRows').eq(0), [
      'Lascario Client Pacheco',
      'Tue, Dec 31 2019',
      '10:44 am',
      'CoachCare'
    ])

    assertTableRow(cy.get('@submissionRows').eq(1), [
      'Lascario Client Pacheco',
      'Tue, Dec 31 2019',
      '6:00 pm',
      'CoachCare'
    ])

    assertTableRow(cy.get('@submissionRows').eq(2), [
      'Lascario Client Pacheco',
      'Wed, Jan 1 2020',
      '10:45 am',
      'CoachCare'
    ])
  })

  it('Shows Form Submission List data in Eastern Time (Australia)', function () {
    cy.setTimezone('aet')
    standardSetup()

    cy.visit(`/library/forms/${Cypress.env('formId')}/submissions`)

    cy.get('app-library-form-submissions-table', { timeout: 12000 })
      .find('mat-row')
      .as('submissionRows')

    cy.get('@submissionRows').should('have.length', 3)

    assertTableRow(cy.get('@submissionRows').eq(0), [
      'Lascario Client Pacheco',
      'Wed, Jan 1 2020',
      '2:44 am',
      'CoachCare'
    ])

    assertTableRow(cy.get('@submissionRows').eq(1), [
      'Lascario Client Pacheco',
      'Wed, Jan 1 2020',
      '10:00 am',
      'CoachCare'
    ])

    assertTableRow(cy.get('@submissionRows').eq(2), [
      'Lascario Client Pacheco',
      'Thu, Jan 2 2020',
      '2:45 am',
      'CoachCare'
    ])
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
    standardSetup({
      apiOverrides: [
        {
          url: `/1.0/content/form/${Cypress.env('formId')}?**`,
          fixture: 'api/form/full-form-removeable'
        },
        {
          url: '/1.0/content/form/submission?**',
          fixture: 'api/form/getListing-removeable'
        }
      ]
    })

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
