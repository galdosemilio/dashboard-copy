import { standardSetup } from '../../../../support'

describe('Reports -> User Statistics -> Coach', function () {
  it('Shows "Last 7 Days" as default timeframe option', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/reports/statistics/coach`)
    cy.get('app-quick-date-range')
  })
})
