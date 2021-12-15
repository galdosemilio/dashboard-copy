import { standardSetup } from '../../../../support'

describe('Dashboard -> Patients -> Patient -> More -> Forms', function () {
  it('Properly lists the device syncing status', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings;s=devices`)

    cy.tick(1000)

    cy.get('app-devices-table').find('mat-row').as('deviceRows')

    cy.get('@deviceRows').should('have.length', 4)

    cy.get('@deviceRows')
      .eq(0)
      .should('contain', 'Fitbit')
      .should('contain', 'Not Connected')
      .should('contain', 'April 9, 2020 at 4:30 am')
    cy.get('@deviceRows')
      .eq(1)
      .should('contain', 'Google Fit')
      .should('contain', 'Not Connected')
      .should('contain', 'July 25, 2018 at 10:30 am')
    cy.get('@deviceRows')
      .eq(2)
      .should('contain', 'HealthKit')
      .should('contain', 'Connected')
      .should('contain', 'September 2, 2020 at 2:07 pm')
    cy.get('@deviceRows')
      .eq(3)
      .should('contain', 'Levl')
      .should('contain', 'Not Connected')
      .should('contain', 'July 25, 2018 at 10:30 am')
  })
})
