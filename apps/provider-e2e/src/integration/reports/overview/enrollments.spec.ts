import { standardSetup } from '../../../support'

describe('Reports -> Overview -> Patient Phase Enrollment', function () {
  it('Shows "Last 7 Days" as default timeframe option', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/reports/overview/enrollments`)
    cy.get('app-quick-date-range').should('contain', 'Last 7 Day')
  })
})
