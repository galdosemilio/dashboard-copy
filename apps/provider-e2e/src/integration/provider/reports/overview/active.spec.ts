import { standardSetup } from '../../../../support'

describe('Reports -> Overview -> Active Users', function () {
  it('Shows "Last 7 Days" as default timeframe option', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/reports/overview/active`)
    cy.get('app-quick-date-range').should('contain', 'Last 12 Months')
  })
})
