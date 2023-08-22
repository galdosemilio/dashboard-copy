import { standardSetup } from '../../../../support'

describe('Dashboard -> Patients -> Patient -> More -> Forms', function () {
  it('Properly lists the device syncing status', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings;s=devices`)

    cy.tick(1000)

    cy.get('app-devices-table').find('mat-row').as('deviceRows')

    cy.get('@deviceRows').should('have.length', 3)

    getDeviceRowToContain(0, [
      'Fitbit',
      'Not Connected',
      'April 9, 2020 at 4:30 am'
    ])
    getDeviceRowToContain(1, [
      'Google Fit',
      'Not Connected',
      'July 25, 2018 at 10:30 am'
    ])
    getDeviceRowToContain(2, [
      'HealthKit',
      'Connected',
      'September 2, 2020 at 2:07 pm'
    ])
  })
})

function getDeviceRowToContain(index, content = []) {
  content.forEach((c) => {
    cy.get('@deviceRows').eq(index).should('contain', c)
  })
}
