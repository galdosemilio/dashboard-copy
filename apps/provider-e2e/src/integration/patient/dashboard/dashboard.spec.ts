import { standardSetup } from '../../../support'

describe('Patient Dashboard', function () {
  it('Loads properly for Generic Organization', function () {
    cy.setOrganization('ccr')
    standardSetup({
      mode: 'client'
    })

    cy.visit(`/`)

    cy.get('app-default-dashboard').should('contain', 'Welcome, Eric')

    cy.get('ccr-next-meeting')
      .should('contain', 'Upcoming')
      .should('contain', 'Appointment')
      .should('contain', 'Final Meeting Appointment')
      .should('contain', 'Sat')
      .should('contain', 'Jan 4')
      .should('contain', '2020')
      .should('contain', '4:45')
      .should('contain', '5:45 am')
      .find('button')
      .should('be.disabled')
  })

  it('Loads properly for WellCore', function () {
    cy.setOrganization('wellcore')
    standardSetup({ mode: 'client' })

    cy.visit('/')

    // @TODO: update this check once the dashboard has been confirmed
    cy.get('app-wellcore-dashboard').should('exist')
  })
})
