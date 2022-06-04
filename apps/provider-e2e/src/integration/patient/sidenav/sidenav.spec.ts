import { standardSetup } from '../../../support'

describe('Patient Sidenav', function () {
  it('Loads properly for a generic organization', function () {
    cy.setOrganization('ccr')
    standardSetup({ mode: 'client' })

    cy.visit('/')

    cy.get('app-menu').find('app-sidenav-item').not('.hidden').as('menuLinks')
    cy.get('@menuLinks').should('have.length', 8)

    cy.get('@menuLinks').eq(0).should('contain', 'Dashboard')
    cy.get('@menuLinks').eq(1).should('contain', 'Messages')
    cy.get('@menuLinks').eq(2).should('contain', 'Digital Library')
    cy.get('@menuLinks').eq(3).should('contain', 'File Vault')
    cy.get('@menuLinks').eq(4).should('contain', 'Profile & Settings')
    cy.get('@menuLinks').eq(5).should('contain', 'Resources')
    cy.get('@menuLinks').eq(6).should('contain', 'Schedule Support Call')
    cy.get('@menuLinks').eq(7).should('contain', 'Email Support')
  })

  it('Loads properly for MuscleWise', function () {
    cy.setOrganization('musclewise')
    standardSetup({ mode: 'client' })

    cy.visit('/')

    cy.get('app-menu').find('app-sidenav-item').not('.hidden').as('menuLinks')
    cy.get('@menuLinks').should('have.length', 9)

    cy.get('@menuLinks').eq(0).should('contain', 'Dashboard')
    cy.get('@menuLinks').eq(1).should('contain', 'Messages')
    cy.get('@menuLinks').eq(2).should('contain', 'Digital Library')
    cy.get('@menuLinks').eq(3).should('contain', 'File Vault')
    cy.get('@menuLinks').eq(4).should('contain', 'Profile & Settings')
    cy.get('@menuLinks').eq(5).should('contain', 'Manage My Subscription')
    cy.get('@menuLinks').eq(6).should('contain', 'Resources')
    cy.get('@menuLinks').eq(7).should('contain', 'Schedule Support Call')
    cy.get('@menuLinks').eq(8).should('contain', 'Email Support')
  })
})
