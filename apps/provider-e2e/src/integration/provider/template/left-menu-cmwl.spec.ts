import { standardSetup } from './../../../support'

describe('Lefthand menu (CMWL)', function () {
  beforeEach(() => {
    cy.setOrganization('cmwl')
    standardSetup()
  })

  it('Test custom case: CMWL, all proper links show', function () {
    cy.visit('/dashboard')

    cy.get('app-menu', {
      timeout: 12000
    })
      .find('app-sidenav-item')
      .not('.hidden')
      .as('menuLinks')
    cy.get('@menuLinks').should('have.length', 22)
    cy.get('@menuLinks').eq(0).should('contain', 'Dashboard')
    cy.get('@menuLinks').eq(1).should('contain', 'Accounts')
    cy.get('@menuLinks').eq(2).should('contain', 'Patients')
    cy.get('@menuLinks').eq(3).should('contain', 'Coaches')
    cy.get('@menuLinks').eq(4).should('contain', 'Clinics')
    cy.get('@menuLinks').eq(5).should('contain', 'Schedule')
    cy.get('@menuLinks').eq(6).should('contain', 'List View')
    cy.get('@menuLinks').eq(7).should('contain', 'Calendar View')
    cy.get('@menuLinks').eq(8).should('contain', 'Set Availability')
    cy.get('@menuLinks').eq(9).should('contain', 'Messages')
    cy.get('@menuLinks').eq(10).should('contain', 'Digital Library')
    cy.get('@menuLinks').eq(11).should('contain', 'Alerts')
    cy.get('@menuLinks').eq(12).should('contain', 'Notifications')
    cy.get('@menuLinks').eq(13).should('contain', 'Settings')
    cy.get('@menuLinks').eq(14).should('contain', 'Reports')
    cy.get('@menuLinks').eq(15).should('contain', 'RPM')
    cy.get('@menuLinks').eq(16).should('contain', 'Communications')
    cy.get('@menuLinks').eq(17).should('contain', 'Resources')
    cy.get('@menuLinks').eq(18).should('contain', 'Updates')
    cy.get('@menuLinks').eq(19).should('contain', 'Schedule Support Call')
    cy.get('@menuLinks').eq(20).should('contain', 'Email Support')
    cy.get('@menuLinks').eq(21).should('contain', 'FAQ & Support Guides')

    // Adding for Cypress issue where page continues to load after spec is done
    cy.get('ccr-dieters-table', {
      timeout: 12000
    })
  })
})
