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
      .should('contain', 'Eric')
      .should('contain', '10:00')
      .should('contain', '10:30 pm')
  })
})
