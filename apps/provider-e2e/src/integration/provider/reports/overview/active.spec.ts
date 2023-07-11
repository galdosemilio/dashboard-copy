import { standardSetup } from '../../../../support'

describe('Reports -> Overview -> Active Users', function () {
  it('Time range selector shows "Last 12 Months" and correct start and end dates by default', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/reports/overview/active`)
    cy.get('app-quick-date-range').should('contain', 'Last 12 Months')
    cy.get('[data-cy="date-range-picker-start"]').contains('1 Dec 2018')
    cy.get('[data-cy="date-range-picker-end"]').contains('31 Dec 2019')
  })
})
