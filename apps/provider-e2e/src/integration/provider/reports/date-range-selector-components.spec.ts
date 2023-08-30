import { standardSetup } from '../../../support'

interface DateRangeOption {
  option:
    | 'Week'
    | 'Last 7 Full Days plus Today'
    | 'This Week'
    | 'Last Week'
    | 'This Month'
    | 'Last Month'
    | 'Last Three Months'
    | 'Last 12 Months'
    | 'This Year'
    | 'All Time'
  start: string
  end: string
}

describe('Reports -> User Statistics -> Patient Activity', function () {
  beforeEach(() => {
    cy.setTimezone('et')
    standardSetup()
    cy.visit(`/reports/overview/signups`)
  })

  it('Date range selector shows correct start and end dates when changes', function () {
    const dateRanges: Array<DateRangeOption> = [
      {
        option: 'Week',
        start: '25 Dec 2019',
        end: '31 Dec 2019'
      },
      {
        option: 'Last 7 Full Days plus Today',
        start: '24 Dec 2019',
        end: '31 Dec 2019'
      },
      {
        option: 'This Week',
        start: '29 Dec 2019',
        end: '4 Jan 2020'
      },
      {
        option: 'Last Week',
        start: '22 Dec 2019',
        end: '28 Dec 2019'
      },
      {
        option: 'This Month',
        start: '1 Dec 2019',
        end: '31 Dec 2019'
      },
      {
        option: 'Last Month',
        start: '1 Nov 2019',
        end: '30 Nov 2019'
      },
      {
        option: 'Last Three Months',
        start: '1 Oct 2019',
        end: '31 Dec 2019'
      },
      {
        option: 'Last 12 Months',
        start: '1 Dec 2018',
        end: '31 Dec 2019'
      },
      {
        option: 'This Year',
        start: '1 Jan 2019',
        end: '31 Dec 2019'
      },
      {
        option: 'All Time',
        start: '1 Jan 2000',
        end: '31 Dec 2019'
      }
    ]

    cy.log('Overview -> Patient Signups should be "Week"')

    cy.wrap(dateRanges).each((rangeOption: DateRangeOption) => {
      changeDateRange(rangeOption.option)

      cy.get('app-quick-date-range').contains(rangeOption.option)
      cy.get('[data-cy="date-range-picker-start"]').contains(rangeOption.start)
      cy.get('[data-cy="date-range-picker-end"]').contains(rangeOption.end)
    })
  })

  it('Date range selector shows correctly as different reports with different default options', function () {
    cy.log('Overview -> Patient Signups should be "Week"')
    cy.get('app-quick-date-range').should('contain', 'Week')
    cy.get('[data-cy="date-range-picker-start"]').contains('25 Dec 2019')
    cy.get('[data-cy="date-range-picker-end"]').contains('31 Dec 2019')

    cy.log('Overview -> Active Users should be "Last 12 Months"')
    cy.get('app-reports-overview').find('a').contains('Active Users').click()
    cy.tick(1000)
    cy.get('app-quick-date-range').should('contain', 'Last 12 Months')
    cy.get('[data-cy="date-range-picker-start"]').contains('1 Dec 2018')
    cy.get('[data-cy="date-range-picker-end"]').contains('31 Dec 2019')

    cy.log('User Statistics -> Patient Statistics should be "Week"')
    cy.get('app-sidenav-item').contains('Reports').click()
    cy.tick(1000)
    cy.get('app-sidenav-item').contains('User Statistics').click()
    cy.tick(1000)
    cy.get('app-quick-date-range').should('contain', 'Week')
    cy.get('[data-cy="date-range-picker-start"]').contains('25 Dec 2019')
    cy.get('[data-cy="date-range-picker-end"]').contains('31 Dec 2019')

    cy.log('Communications should be "This Month"')
    cy.get('app-sidenav-item').contains('Communications').click()
    cy.tick(1000)
    cy.get('app-quick-date-range').contains('This Month')
    cy.get('[data-cy="date-range-picker-start"]').contains('1 Dec 2019')
    cy.get('[data-cy="date-range-picker-end"]').contains('31 Dec 2019')
  })

  it('Date range selector state should not be retained between page views', function () {
    cy.log(
      'Overview -> Patient Signups should be "Week", then change to "Last Month"'
    )
    cy.get('app-quick-date-range').should('contain', 'Week')
    cy.get('[data-cy="date-range-picker-start"]').contains('25 Dec 2019')
    cy.get('[data-cy="date-range-picker-end"]').contains('31 Dec 2019')
    changeDateRange('Last Month')
    cy.tick(1000)
    cy.get('app-quick-date-range').should('contain', 'Last Month')
    cy.get('[data-cy="date-range-picker-start"]').contains('1 Nov 2019')
    cy.get('[data-cy="date-range-picker-end"]').contains('30 Nov 2019')

    cy.log(
      'Overview -> Active Users should be "Last 12 Months", then change to "Last Three Months'
    )
    cy.get('app-reports-overview').find('a').contains('Active Users').click()
    cy.tick(1000)
    cy.get('app-quick-date-range').should('contain', 'Last 12 Months')
    cy.get('[data-cy="date-range-picker-start"]').contains('1 Dec 2018')
    cy.get('[data-cy="date-range-picker-end"]').contains('31 Dec 2019')
    changeDateRange('Last Three Months')
    cy.tick(1000)
    cy.get('app-quick-date-range').should('contain', 'Last Three Months')
    cy.get('[data-cy="date-range-picker-start"]').contains('1 Oct 2019')
    cy.get('[data-cy="date-range-picker-end"]').contains('31 Dec 2019')

    cy.log(
      'Overview -> Patient Phase Enrollment should be "Week", then change to "This Year"'
    )
    cy.get('app-reports-overview')
      .find('a')
      .contains('Patient Phase Enrollment')
      .click()
    cy.tick(1000)
    cy.get('app-quick-date-range').should('contain', 'Week')
    cy.get('[data-cy="date-range-picker-start"]').contains('25 Dec 2019')
    cy.get('[data-cy="date-range-picker-end"]').contains('31 Dec 2019')

    cy.log('Overview -> Patient Signups should be "Week"')
    cy.get('app-reports-overview').find('a').contains('Patient Signups').click()
    cy.tick(1000)
    cy.get('app-quick-date-range').should('contain', 'Week')
    cy.get('[data-cy="date-range-picker-start"]').contains('25 Dec 2019')
    cy.get('[data-cy="date-range-picker-end"]').contains('31 Dec 2019')
  })

  it('Date range selector should change dates correcly Last Three Months', function () {
    changeDateRange('Last Three Months')
    cy.get('[data-cy="date-ranger-picker-left-click"]').click()

    cy.get('[data-cy="date-range-picker-start"]').contains('1 Jul 2019')
    cy.get('[data-cy="date-range-picker-end"]').contains('30 Sep 2019')
  })

  it('Date range selector should change dates correcly This Month', function () {
    changeDateRange('This Month')
    cy.get('[data-cy="date-ranger-picker-left-click"]').click()
    cy.get('[data-cy="date-ranger-picker-left-click"]').click()
    cy.get('[data-cy="date-ranger-picker-left-click"]').click()
    cy.get('[data-cy="date-ranger-picker-left-click"]').click()
    cy.get('[data-cy="date-ranger-picker-left-click"]').click()
    cy.get('[data-cy="date-ranger-picker-left-click"]').click()
    cy.get('[data-cy="date-ranger-picker-left-click"]').click()
    cy.get('[data-cy="date-ranger-picker-left-click"]').click()
    cy.get('[data-cy="date-ranger-picker-left-click"]').click()

    cy.get('[data-cy="date-range-picker-start"]').contains('1 Mar 2019')
    cy.get('[data-cy="date-range-picker-end"]').contains('31 Mar 2019')

    cy.get('[data-cy="date-ranger-picker-left-click"]').click()

    cy.get('[data-cy="date-range-picker-start"]').contains('1 Feb 2019')
    cy.get('[data-cy="date-range-picker-end"]').contains('28 Feb 2019')

    cy.get('[data-cy="date-ranger-picker-right-click"]').click()
    cy.get('[data-cy="date-range-picker-start"]').contains('1 Mar 2019')
    cy.get('[data-cy="date-range-picker-end"]').contains('31 Mar 2019')
  })

  it('Date range selector should change dates correcly This Year', function () {
    changeDateRange('This Year')
    cy.get('[data-cy="date-ranger-picker-left-click"]').click()

    cy.get('[data-cy="date-range-picker-start"]').contains('1 Jan 2018')
    cy.get('[data-cy="date-range-picker-end"]').contains('31 Dec 2018')
  })
})

function changeDateRange(
  changeTo:
    | 'Week'
    | 'Last 7 Full Days plus Today'
    | 'This Week'
    | 'Last Week'
    | 'This Month'
    | 'Last Month'
    | 'Last Three Months'
    | 'Last 12 Months'
    | 'This Year'
    | 'All Time'
): void {
  cy.get('app-quick-date-range').click()

  cy.tick(1000)

  cy.get('.mat-select-panel-wrap')
    .find('mat-option')
    .contains(changeTo)
    .trigger('click', { force: true })
    .wait(500)

  cy.tick(1000)
}
