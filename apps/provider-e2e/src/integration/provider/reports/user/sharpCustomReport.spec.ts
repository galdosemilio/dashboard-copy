import { standardSetup } from '../../../../support'

describe('Reports -> User Statistics -> Sharp Custom Report', function () {
  this.beforeEach(() => {
    cy.setOrganization('sharp')
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/reports/statistics/sharp`)
  })

  it('Time range selector shows "Last 7 Days" with correct start and end dates by default', function () {
    cy.get('app-quick-date-range').should('contain', 'Last 7 Days')
    cy.get('[data-cy="date-range-picker-start"]').contains('24 Dec 2019')
    cy.get('[data-cy="date-range-picker-end"]').contains('31 Dec 2019')
  })
  it('Sharp custom report header row shows correctly', function () {
    const columnHeaders = [
      '#',
      'First Name',
      'Last Name',
      'DOB',
      'Kcal',
      'Exercise Minutes',
      'Meal Replacement',
      'Vegetables & Fruits'
    ]

    cy.get('mat-header-row')
      .find('mat-header-cell')
      .each((col, index) => {
        cy.wrap(col).should('have.text', columnHeaders[index])
      })
  })

  it('Sharp custom report retains date selections between page view', function () {
    cy.get('[data-cy="date-ranger-picker-left-click"]').trigger('click')

    checkStartAndEndDates()

    cy.get('app-reports-statistics')
      .find('a')
      .contains('Patient Statistics')
      .click()
    cy.tick(1000)
    cy.get('app-reports-statistics')
      .find('a')
      .contains('Sharp Custom Report')
      .click()

    checkStartAndEndDates()
  })

  it('Sharp custom report retains date selections between page refresh', function () {
    cy.get('[data-cy="date-ranger-picker-left-click"]').trigger('click')

    checkStartAndEndDates()

    cy.reload()

    checkStartAndEndDates()
  })
})

function checkStartAndEndDates(): void {
  cy.tick(1000)

  cy.get('[data-cy="date-range-picker-start"]').contains('17 Dec 2019')
  cy.get('[data-cy="date-range-picker-end"]').contains('24 Dec 2019')
}
