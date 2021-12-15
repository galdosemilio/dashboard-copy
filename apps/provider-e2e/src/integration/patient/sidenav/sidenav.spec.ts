import { standardSetup } from '../../../support'

describe('Patient Sidenav', function () {
  it('Loads properly for a generic organization', function () {
    cy.setOrganization('ccr')
    standardSetup({ mode: 'client' })

    cy.visit('/')

    cy.get('app-menu').find('app-sidenav-item').not('.hidden').as('menuLinks')
    cy.get('@menuLinks').should('have.length', 6)

    cy.get('@menuLinks').eq(0).should('contain', 'Dashboard')
    cy.get('@menuLinks').eq(1).should('contain', 'Messages')
    cy.get('@menuLinks').eq(2).should('contain', 'Profile & Settings')
    cy.get('@menuLinks').eq(3).should('contain', 'Resources')
    cy.get('@menuLinks').eq(4).should('contain', 'Schedule Support Call')
    cy.get('@menuLinks').eq(5).should('contain', 'Email Support')
  })

  it('Loads properly for WellCore', function () {
    cy.setOrganization('wellcore')
    standardSetup({ mode: 'client' })

    cy.visit('/')

    cy.get('app-menu-wellcore')
      .find('app-sidenav-item')
      .not('.hidden')
      .as('menuLinks')
    cy.get('@menuLinks').should('have.length', 7)

    // DIGITAL LIBRARY doesn't appear here because we turn it off if it's not CoachCare
    cy.get('@menuLinks').eq(0).should('contain', 'Dashboard')
    cy.get('@menuLinks').eq(1).should('contain', 'Appointments')
    cy.get('@menuLinks').eq(2).should('contain', 'Lab Results')
    cy.get('@menuLinks').eq(3).should('contain', 'Profile & Settings')
    cy.get('@menuLinks').eq(4).should('contain', 'Resources')
    cy.get('@menuLinks').eq(5).should('contain', 'Schedule Support Call')
    cy.get('@menuLinks').eq(6).should('contain', 'Email Support')
  })

  it('Loads properly for MuscleWise', function () {
    cy.setOrganization('musclewise')
    standardSetup({ mode: 'client' })

    cy.visit('/')

    cy.get('app-menu').find('app-sidenav-item').not('.hidden').as('menuLinks')
    cy.get('@menuLinks').should('have.length', 7)

    cy.get('@menuLinks').eq(0).should('contain', 'Dashboard')
    cy.get('@menuLinks').eq(1).should('contain', 'Messages')
    cy.get('@menuLinks').eq(2).should('contain', 'Profile & Settings')
    cy.get('@menuLinks').eq(3).should('contain', 'Manage My Subscription')
    cy.get('@menuLinks').eq(4).should('contain', 'Resources')
    cy.get('@menuLinks').eq(5).should('contain', 'Schedule Support Call')
    cy.get('@menuLinks').eq(6).should('contain', 'Email Support')
  })
})
