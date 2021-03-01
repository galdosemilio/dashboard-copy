import { standardSetup } from '../../support'

describe('Clinics -> Clinic -> Automatic Sequence Enrollment', function () {
  it('Properly displays Automatic Sequence Enrollment entries', function () {
    standardSetup()
    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=auto-enrollment`)

    cy.get('app-clinic-sequence-auto-enrollment')
      .find('tbody')
      .find('tr')
      .as('autoEnrollmentRows')

    cy.get('@autoEnrollmentRows')
      .eq(0)
      .should('contain', '1')
      .should('contain', 'first sequence')
      .should('contain', 'tuesday')
    cy.get('@autoEnrollmentRows')
      .eq(1)
      .should('contain', '2')
      .should('contain', 'second sequence')
      .should('contain', '15 days')
    cy.get('@autoEnrollmentRows')
      .eq(2)
      .should('contain', '3')
      .should('contain', 'third sequence')
      .should('contain', '20 of every month')
  })

  it('Allows a provider to add an Automatic Sequence Enrollment entry', function () {
    standardSetup()
    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=auto-enrollment`)

    cy.get('app-clinic-sequence-auto-enrollment')
      .find('tbody')
      .find('tr')
      .as('autoEnrollmentRows')
      .should('have.length', 3)

    cy.get('button').contains('Add Autoenrollment').click()

    cy.tick(1000)

    cy.get('mat-dialog-container')
      .find('div.mat-select-trigger')
      .eq(0)
      .click()
      .wait(500)

    cy.tick(1000)

    cy.get('mat-option').eq(0).click()

    cy.tick(1000)

    cy.get('mat-dialog-container').find('button').contains('Add').click()

    cy.tick(1000)

    cy.wait('@sequenceAutoEnrollmentPutRequest').should((xhr) => {
      expect(xhr.request.body.id).to.equal('1')
      expect(xhr.request.body.time).to.equal('00:00:00')
      expect(xhr.request.body.offset.dayOfWeek).to.equal(0)
      expect(xhr.request.body.transition).to.equal('1674')
    })
  })

  it('Allows a provider to remove an Automatic Sequence Enrollment entry', function () {
    standardSetup()
    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=auto-enrollment`)

    cy.get('app-clinic-sequence-auto-enrollment')
      .find('tbody')
      .find('tr')
      .as('autoEnrollmentRows')
      .should('have.length', 3)

    cy.get('@autoEnrollmentRows')
      .eq(0)
      .find('mat-icon')
      .contains('delete')
      .click()

    cy.tick(1000)

    cy.get('mat-dialog-container').find('button').contains('Yes').click()

    cy.tick(1000)

    cy.wait('@patchSequence').should((xhr) => {
      expect(xhr.request.body.id).to.equal('1')
      expect(xhr.request.body.enrollmentOnAssociation).to.equal(false)
    })
  })

  it('Prevents an unauthorized provider from managing the Automatic Sequence Enrollment entries', function () {
    standardSetup(undefined, [
      {
        url: '/2.0/access/organization?**',
        fixture: 'api/organization/getAll-noadmin'
      }
    ])
    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=auto-enrollment`)

    cy.get('app-clinic-sequence-auto-enrollment')
      .find('tbody')
      .find('tr')
      .as('autoEnrollmentRows')
      .should('have.length', 3)

    cy.get('app-clinic-sequence-auto-enrollment')
      .find('button')
      .contains('Add Autoenrollment')
      .parent()
      .should('be.disabled')

    cy.get('@autoEnrollmentRows')
      .eq(0)
      .find('mat-icon')
      .contains('delete')
      .should('have.class', 'disabled')
  })
})
