import { standardSetup } from '../../support'

describe('Sequences -> enrollment and unenrollment', function () {
  it('Enroll Listing includes org of loaded sequence to filter org and account fetching', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/sequences/sequence/${Cypress.env('sequenceId')}`)

    cy.tick(10000)

    cy.get('[data-cy="sequence-button-enrollees"]').click()
    cy.get('[data-cy="sequence-enroll"]').click()

    cy.wait('@api-access_organization_sequence')
      .its('request.url')
      .should('include', 'ancestor=999')

    cy.tick(10000)

    cy.get('[data-cy="sequence-enroll-search-patients"]')
      .wait(500)
      .find('[data-cy="user-search-input"]')
      .wait(500)
      .type('eric')

    cy.tick(10000)

    cy.wait('@api-access_account')
      .its('request.url')
      .should('include', 'organization=999')
  })
  it('Unenroll Listing button inactive if no enrollments', function () {
    cy.setTimezone('et')
    standardSetup(undefined, [
      {
        url: '/1.0/sequence/enrollment**',
        fixture: 'api/general/emptyDataEmptyPagination'
      }
    ])

    cy.visit(`/sequences/sequence/${Cypress.env('sequenceId')}`)

    cy.tick(10000)

    cy.get('[data-cy="sequence-button-enrollees"]').click()
    cy.get('[data-cy="sequence-unenroll"]').should('have.attr', 'disabled')
  })

  it('Unenroll Listing includes org of selected sequence to filter org fetching', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/sequences/sequence/${Cypress.env('sequenceId')}`)

    cy.tick(10000)

    cy.get('[data-cy="sequence-button-enrollees"]').click()
    cy.get('[data-cy="sequence-unenroll"]').click()

    cy.wait('@api-access_organization_sequence')
      .its('request.url')
      .should('include', 'ancestor=999')
  })
})
