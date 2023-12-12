import { standardSetup } from '../../../support'

describe('Dashboard -> Patient Own Profile', function () {
  it('View patient own profile with 3 tabs', function () {
    standardSetup({
      mode: 'client'
    })

    cy.visit(`/profile`)

    cy.get('div.ccr-tabs').find('a').as('patientMenuLinks')

    cy.get('@patientMenuLinks').should('have.length', 3)
    cy.get('@patientMenuLinks').eq(0).should('contain', ' Profile')
    cy.get('@patientMenuLinks').eq(1).should('contain', ' Addresses')
    cy.get('@patientMenuLinks').eq(2).should('contain', ' Security')
    cy.get('account-form')
  })

  it('Should have delete account button for patient', function () {
    standardSetup({
      mode: 'client'
    })

    cy.visit(`/profile`)

    cy.get('app-profile')
      .find('button')
      .contains('Delete Account')
      .should('exist')
  })

  describe.only('Delete Account Dialog', () => {
    beforeEach(() => {
      standardSetup({
        mode: 'client'
      })

      cy.visit(`/profile`)

      cy.get('app-profile')
        .find('button')
        .contains('Delete Account')
        .click({ force: true })

      cy.get('account-delete-dialog')
        .find('button')
        .contains('Delete Account')
        .as('deleteButton')
    })

    it('Should disabled delete button as default', () => {
      checkDeleteButton(false)
    })

    it('Should disabled delete button with wrong confirmation email', () => {
      cy.tick(10000)
      cy.get('account-delete-dialog').find('input').type('invalid@gmail.com')

      checkDeleteButton(false)
    })

    it('Should enable delete button with correct confirmation email', () => {
      cy.tick(10000)
      cy.get('account-delete-dialog')
        .find('input')
        .type('eric.dibari@gmail.com')

      checkDeleteButton(true)

      cy.get('@deleteButton').click()
      cy.wait('@deactivateAccount').should((xhr) => {
        expect(xhr.response.statusCode).to.equal(200)
      })
    })
  })
})

function checkDeleteButton(enabled: boolean) {
  cy.get('@deleteButton')
    .parent()
    .should(enabled ? 'be.not.disabled' : 'be.disabled')
}
