import { standardSetup } from '../../../../support'

describe('Reports -> Overview -> Patient Signups', function () {
  it('Time range selector shows "Last 7 Days" with correct start and end dates by default', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/reports/overview/signups`)
    cy.get('app-quick-date-range').should('contain', 'Last 7 Days')
    cy.get('[data-cy="date-range-picker-start"]').contains('24 Dec 2019')
    cy.get('[data-cy="date-range-picker-end"]').contains('31 Dec 2019')
  })
})
