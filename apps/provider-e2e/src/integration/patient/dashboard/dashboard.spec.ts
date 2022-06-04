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
      .should('contain', 'Wed')
      .should('contain', 'Jan 1')
      .should('contain', '2020')
      .should('contain', '12:00')
      .should('contain', '12:30 am')
  })
})
