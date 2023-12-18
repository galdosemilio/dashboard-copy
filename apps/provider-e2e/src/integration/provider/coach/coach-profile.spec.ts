import { standardSetup } from '../../../support'

describe('Dashboard -> Coach Profile', function () {
  it('View coach profile with 5 tabs', function () {
    standardSetup()

    cy.visit(`/accounts/coaches/${Cypress.env('providerIdOther')}`)

    cy.get('[data-cy="coachProfileMenu"]').find('a').as('coachMenuLinks')

    cy.get('@coachMenuLinks').should('have.length', 5)
    cy.get('@coachMenuLinks').eq(0).should('contain', ' Profile')
    cy.get('@coachMenuLinks').eq(1).should('contain', ' Addresses')
    cy.get('@coachMenuLinks').eq(2).should('contain', ' Clinics')
    cy.get('@coachMenuLinks').eq(3).should('contain', ' Communications')
    cy.get('@coachMenuLinks').eq(4).should('contain', ' Login History')
  })

  it.only('Should not allow to change ip restricted email', function () {
    standardSetup()
    cy.intercept('GET', '/1.0/security/ip-restriction', {
      fixture: 'api/security/getIPWithRestriction'
    }).as('getIPRestriction')

    cy.visit(`/accounts/coaches/${Cypress.env('providerIdOther')}`)

    cy.get('[data-cy="coachProfileMenu"]').find('a').as('coachMenuLinks')

    cy.tick(1000)

    cy.get('app-coach-profile')
      .find('input[formcontrolname="email"]')
      .should('have.attr', 'readonly', 'readonly')

    cy.get('mat-hint').should(
      'contain',
      'Email domain has an IP address restriction. Please contact support to change the email address.'
    )

    cy.get('app-coach-profile')
      .find('button')
      .contains('Update Coach')
      .click({ force: true })

    cy.wait('@accountPatchRequest')
    cy.wait('@accountPatchRequest').should((xhr) => {
      expect(xhr.request.body).to.not.include({
        email: 'eric.dibari@gmail.com'
      })
    })
  })
})
