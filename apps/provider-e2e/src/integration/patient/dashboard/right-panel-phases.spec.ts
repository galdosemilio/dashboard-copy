import { standardSetup } from './../../../support'

describe('Patient Dashboard Right Panel Phases', function () {
  it('Properly shows the component', function () {
    cy.setOrganization('shiftsetgo')
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    cy.get('app-right-panel').find('app-rightpanel-phases').should('exist')

    cy.wait(3000)
  })

  it('Properly shows the list of enrolled phases', function () {
    cy.setOrganization('shiftsetgo')
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    cy.get('app-right-panel').find('app-rightpanel-phases').should('exist')

    cy.tick(10000)

    cy.get('app-right-panel').find('li').as('phaseEnrollmentItem')
    cy.get('@phaseEnrollmentItem').should('have.length', 1)

    cy.get('@phaseEnrollmentItem').eq(0).should('contain', 'Package 1')
    cy.get('@phaseEnrollmentItem').eq(0).should('contain', 'ID 1')

    cy.wait(3000)
  })

  it('Properly redirects to the phase management page when the button is clicked', function () {
    cy.setOrganization('shiftsetgo')
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    cy.get('app-right-panel').find('app-rightpanel-phases').should('exist')

    cy.tick(10000)

    cy.get('app-right-panel')
      .find('button')
      .contains('Manage Phases')
      .click({ force: true })

    cy.location().should((location) => {
      expect(location.href).to.contain('settings;s=labels')
    })

    cy.wait(2000)
  })

  it('Properly adds the phase on enrolling', function () {
    cy.setOrganization('shiftsetgo')
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings;s=labels`)

    cy.get('app-dieter-labels').find('mat-row').as('phaseRows')
    cy.get('app-right-panel').find('app-rightpanel-phases')

    cy.tick(10000)

    cy.get('@phaseRows').eq(1).find('a.ccr-button').click({ force: true })
    cy.tick(1000)

    cy.get('app-right-panel')
      .find('app-rightpanel-phases')
      .should('contain', 'Package 2')

    cy.wait(1000)
  })

  it('Properly removes the phase on unenrolling', function () {
    cy.setOrganization('shiftsetgo')
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings;s=labels`)

    cy.get('app-dieter-labels').find('mat-row').as('phaseRows')
    cy.get('app-right-panel').find('app-rightpanel-phases')

    cy.tick(10000)

    cy.get('@phaseRows').eq(0).find('a.ccr-button').click({ force: true })
    cy.tick(1000)

    cy.get('mat-dialog-container')
      .find('button')
      .contains('Unenroll')
      .click({ force: true })
    cy.tick(1000)

    cy.get('app-right-panel')
      .find('app-rightpanel-phases')
      .should('not.contain', 'Package 1')

    cy.wait(1000)
  })
})
