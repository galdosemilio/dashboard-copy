import { standardSetup } from '../../../support'

describe('Patient Dashboard', function () {
  it('Loads properly for Generic Organization', function () {
    cy.setOrganization('ccr')
    standardSetup({
      mode: 'client'
    })

    cy.visit('/dashboard')

    cy.get('app-default-dashboard').should('contain', 'Welcome, Eric')

    cy.get('ccr-next-meeting')
      .should('contain', 'Upcoming')
      .should('contain', 'Appointment')
      .should('contain', 'Initial 1 on 1 meeting Appointment')
      .should('contain', 'Tue')
      .should('contain', 'Dec 31')
      .should('contain', '2019')
      .should('contain', '10:00')
      .should('contain', '10:30 pm')
  })

  it('Loads properly for WellCore', function () {
    cy.setOrganization('wellcore')
    standardSetup({ mode: 'client' })

    cy.visit('/dashboard')

    // @TODO: update this check once the dashboard has been confirmed
    cy.get('app-wellcore-dashboard').should('exist')
  })
})
