import { standardSetup } from '../../../../support'

describe('Reports -> User Statistics -> Sharp Custom Report', function () {
  this.beforeEach(() => {
    cy.setOrganization('sharp')
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/reports/statistics/sharp`)
  })

  it('Time range selector shows "Week" with correct start and end dates by default', function () {
    cy.get('app-quick-date-range').should('contain', 'Week')
    cy.get('[data-cy="date-range-picker-start"]').contains('25 Dec 2019')
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

  it('Sharp custom report retains date selections between page refres, and arrow is not deactivated', function () {
    cy.get('[data-cy="date-ranger-picker-right-click"]').should(
      'have.class',
      'disabled'
    )
    cy.get('[data-cy="date-ranger-picker-left-click"]').trigger('click')

    checkStartAndEndDates()

    cy.reload()

    checkStartAndEndDates()

    cy.get('[data-cy="date-ranger-picker-right-click"]').should(
      'not.have.class',
      'disabled'
    )

    selectRange('This Month', '1 Dec 2019', '31 Dec 2019')
    selectRange('Week', '25 Dec 2019', '31 Dec 2019')
  })
})

function selectRange(range: 'Week' | 'This Month', start: string, end: string) {
  cy.get('app-quick-date-range').click()
  cy.tick(1000)

  cy.get('.mat-select-panel-wrap')
    .find('mat-option')
    .contains(range)
    .trigger('click', { force: true })
    .wait(500)

  cy.get('[data-cy="date-range-picker-start"]').contains(start)
  cy.get('[data-cy="date-range-picker-end"]').contains(end)
}

function checkStartAndEndDates(): void {
  cy.tick(1000)

  cy.get('[data-cy="date-range-picker-start"]').contains('18 Dec 2019')
  cy.get('[data-cy="date-range-picker-end"]').contains('24 Dec 2019')
}
