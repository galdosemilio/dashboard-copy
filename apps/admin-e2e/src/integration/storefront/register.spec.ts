import { standardSetup } from '../../support'
import { interceptSpreeApiCalls } from '../../support/spreeApi'

describe('Loading Storefront product dialog', function () {
  beforeEach(() => {
    cy.setTimezone('et')
    standardSetup(true)
    interceptSpreeApiCalls()
    cy.visit(
      `/register/checkout?billing=hidden&shipping=hidden&actionButtonType=storefront`
    )
    cy.tick(20000)
  })

  it('should be able to register', function () {
    cy.get('.ccr-checkout-form')
      .first()
      .within(() => {
        cy.get(`[formcontrolname="firstName"]`).type('John')
        cy.get(`[formcontrolname="lastName"]`).type('Doe')
        cy.get(`[formcontrolname="email"]`).type('john1@coachcare.com')
        cy.get(`[formcontrolname="emailConfirmation"]`).type(
          'john1@coachcare.com'
        )
        cy.get(`[formcontrolname="password"]`).type('Pass12345!')
        cy.get(`[formcontrolname="passwordConfirmation"]`).type('Pass12345!')
        cy.get(`[formcontrolname="phoneNumber"]`).type('619-444-7267')
        cy.get(`[formcontrolname="birthday"]`)
          .first()
          .within(() => {
            cy.get(`[formcontrolname="date"]`).click()
            cy.get(`[formcontrolname="textDate"]`).type('02/02/1992')
          })
        cy.get('mat-select[formControlName=height]')
          .click()
          .get('mat-option', { withinSubject: null })
          .contains('3’0"')
          .click()
        cy.get('mat-select[formControlName=gender]')
          .click()
          .get('mat-option', { withinSubject: null })
          .contains('Male')
          .click()
        cy.get(`[formcontrolname="agreements"] mat-checkbox`).click()
        cy.get('[data-cy="next-button"]', { withinSubject: null }).click()
      })
    cy.get('[data-cy="next-button"]', { withinSubject: null })
      .contains('Go to Store')
      .click()
    cy.tick(20000)
    cy.get('.storefront-loading').should('not.exist')
    cy.get('h2').should('contain', 'CoachCare Store')
  })
})
