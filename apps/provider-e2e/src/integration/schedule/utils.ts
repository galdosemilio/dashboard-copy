export function selectDate(date: number, month: string, year: number): void {
  cy.get('date-navigator').find('button.mat-icon-button').click({ force: true })

  cy.tick(1000)

  cy.get('button.mat-calendar-header-date-year').click({ force: true })

  cy.get('span.mat-calendar-years-item')
    .contains(`${year}`)
    .click({ force: true })
  cy.tick(1000)
  cy.get('span.mat-calendar-body-cell-content')
    .contains(month)
    .click({ force: true })
  cy.tick(1000)
  cy.get('span.mat-calendar-body-cell-content')
    .contains(`${date}`)
    .click({ force: true })
  cy.tick(1000)

  cy.get('div.mat-calendar-content')
    .find('button')
    .contains('OK')
    .click({ force: true })
  cy.tick(1000)

  cy.wait(1000)
}

export function assertMeeting(title: string, data: any): void {
  const meetingAlias = getMeetingAlias(title)

  Object.keys(data).forEach((key) => {
    cy.get(meetingAlias).contains(data[key])
  })

  cy.tick(1000)
}

export function getMeetingAlias(meetingTitle: string): string {
  cy.tick(1000)
  const tag = Date.now() + `${Math.round(Math.random() * 100)}`
  cy.get('div.meeting')
    .contains(meetingTitle)
    .parent()
    .parent()
    .as(`meeting${tag}`)

  // so the 'Date.now()' changes, diminishing the chances of collision
  cy.tick(Math.round(Math.random()) + 1)
  return `@meeting${tag}`
}

export function setViewMode(mode: 'day' | 'week'): void {
  cy.get('button.ccr-icon-button')
    .contains(new RegExp(`${mode}`, 'i'))
    .click({ force: true })

  cy.tick(1000)
}

export enum WeekDays {
  SUNDAY = 1,
  MONDAY = 2,
  TUESDAY = 3,
  WEDNESDAY = 4,
  THURSDAY = 5,
  FRIDAY = 6,
  SATURDAY = 7
}

export interface Availability {
  day: WeekDays
  hour:
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
  minute: 0 | 15 | 30 | 45
}

// Check for a block of availability or unavailability during a single day.  If 'end' is omitted, only the single 15 minute block is checked
export function verifyDayAvailability(
  type: 'available' | 'unavailable',
  start: Availability,
  end?: Availability
): void {
  const column: number = start.day
  const startRow: number = start.hour * 4 + start.minute / 15 + 1
  const endRow: number =
    end === undefined ? startRow : end.hour * 4 + end.minute / 15

  cy.get('[data-cy="schedule-calendar-view-body"]')
    .find('td')
    .filter((c) => c % 8 === column) // prune selection to day column
    .filter((c) => c >= startRow && c <= endRow) // prune selection to only cells within examined time range
    .should(type === 'available' ? 'have.class' : 'not.have.class', 'available')
    .should('have.css', 'background-color')
    .and(
      'eq',
      type === 'available' ? 'rgb(255, 255, 255)' : 'rgb(245, 245, 245)'
    )

  cy.tick(1000)
}
