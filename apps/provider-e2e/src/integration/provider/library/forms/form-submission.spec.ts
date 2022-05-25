import { standardSetup } from '../../../../support'

describe('Dashboard -> Digital Library -> Forms -> Form -> Form Submission', function () {
  it('Submit form', function () {
    cy.setTimezone('et')
    standardSetup({
      apiOverrides: [
        {
          url: '/1.0/content/form/submission?**',
          fixture: 'api/general/emptyData'
        }
      ]
    })

    cy.visit(`/library/forms/${Cypress.env('formId')}/fill`)

    cy.get('[cy-data="form-submission-patient-yes"]').click()

    cy.tick(10000)

    cy.get('ccr-dieters-table').find('mat-row').first().click()

    cy.tick(10000)

    cy.get('app-library-short-answer-question').find('textarea').type('123')

    cy.get('button').contains('Save').click()

    cy.wait('@formSubmit').should((xhr) => {
      expect(xhr.request.body.form).to.equal('10161')
      expect(xhr.request.body.account).to.equal(1)
      expect(xhr.request.body.submittedBy).to.equal(1)
      expect(xhr.request.body.answers[0].question).to.equal('1')
      expect(xhr.request.body.answers[0].response.value).to.equal('123')
    })
  })
  it('Should show Form Submission data in Eastern Time (New York)', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(
      `/library/forms/${Cypress.env('formId')}/submissions/${Cypress.env(
        'formSubmissionId'
      )}`
    )

    cy.get('app-library-form-manager', { timeout: 12000 })
      .find('span')
      .eq(0)
      .as('formHeader')

    cy.get('@formHeader')
      .should('contain', 'Tue, Dec 31 2019')
      .should('contain', '10:44 am')
      .should('contain', 'CoachCare')
  })

  it('Should show Form Submission data in Eastern Time (Australia)', function () {
    cy.setTimezone('aet')
    standardSetup()

    cy.visit(
      `/library/forms/${Cypress.env('formId')}/submissions/${Cypress.env(
        'formSubmissionId'
      )}`
    )

    cy.get('app-library-form-manager', { timeout: 12000 })
      .find('span')
      .eq(0)
      .as('formHeader')

    cy.get('@formHeader')
      .should('contain', 'Wed, Jan 1 2020')
      .should('contain', '2:44 am')
      .should('contain', 'CoachCare')
  })

  it('Saves a draft', function () {
    cy.setTimezone('et')
    standardSetup({
      apiOverrides: [
        {
          url: '/1.0/content/form/submission?**',
          fixture: 'api/general/emptyData'
        }
      ]
    })

    cy.visit(`/library/forms/${Cypress.env('formId')}/fill`)

    cy.get('[cy-data="form-submission-patient-yes"]').click()

    cy.tick(10000)

    cy.get('ccr-dieters-table').find('mat-row').first().click()

    cy.tick(10000)

    cy.get('app-library-short-answer-question').find('textarea').type('123')

    cy.tick(10000)

    cy.wait('@upsertFormSubmissionDraft').should((xhr) => {
      expect(xhr.request.body.data.form['0']['1'].value).to.equal('123')
    })
  })
})
