import { standardSetup } from '../../../support'
import { assertMeeting, selectDate, setViewMode } from './utils'

describe('Schedule -> view', function () {
  it.only('Schedule shows properly in ET (New York)', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/schedule/view`)

    cy.get('.calendar-wrapper').should('exist')

    cy.tick(1000)

    // Main buttons
    cy.get('.calendar-wrapper').find('th').as('calendarHeaders')
    cy.get('@calendarHeaders').should('have.length', 8)

    cy.get('@calendarHeaders').eq(1).should('contain', 'Sun 29')

    cy.get('@calendarHeaders').eq(7).should('contain', 'Sat 4')

    cy.get('.calendar-body').as('calendarBody')

    cy.get('@calendarBody')
      .should('contain', '10:00-10:30pm')
      .should('contain', 'Test meeting 1')
      .should('contain', '3 attendees')

    cy.get('@calendarBody')
      .should('contain', '3:00-4:30pm')
      .should('contain', 'Test meeting 2')
      .should('contain', '2 attendees')

    cy.get('@calendarBody')
      .should('contain', '2:00-3:00am')
      .should('contain', 'Test meeting 3')
      .should('contain', '1 attendee')

    cy.get('@calendarBody')
      .should('contain', '2:00-3:00am')
      .should('contain', 'Test meeting 4')
      .should('contain', '1 attendee')

    cy.get('@calendarBody')
      .should('contain', '2:45-3:45am')
      .should('contain', 'Test meeting 5')
      .should('contain', '1 attendee')
  })

  it('Schedule shows properly in AET (Australia Eastern)', function () {
    cy.setTimezone('aet')
    standardSetup()

    cy.visit(`/schedule/view`)

    // Main buttons
    cy.get('.calendar-wrapper').find('th').as('calendarHeaders')
    cy.get('@calendarHeaders').should('have.length', 8)

    cy.get('@calendarHeaders').eq(1).should('contain', 'Sun 29')

    cy.get('@calendarHeaders').eq(7).should('contain', 'Sat 4')

    cy.get('.calendar-body').as('calendarBody')

    cy.get('@calendarBody')
      .should('contain', '2:00-2:30pm')
      .should('contain', 'Test meeting 1')
      .should('contain', '3 attendees')

    cy.get('@calendarBody')
      .should('contain', '7:00-8:30am')
      .should('contain', 'Test meeting 2')
      .should('contain', '2 attendees')

    cy.get('@calendarBody')
      .should('contain', '6:00-7:00pm')
      .should('contain', 'Test meeting 3')
      .should('contain', '1 attendee')

    cy.get('@calendarBody')
      .should('contain', '6:00-7:00pm')
      .should('contain', 'Test meeting 4')
      .should('contain', '1 attendee')

    cy.get('@calendarBody')
      .should('contain', '6:45-7:45pm')
      .should('contain', 'Test meeting 5')
      .should('contain', '1 attendee')
  })

  it('Schedule shows properly with DST forward on week mode (New York)', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.intercept('GET', '/4.0/meeting?**', {
      fixture: 'api/meeting/getListingRecurringMarch'
    })
    cy.visit(`/schedule/view`)

    cy.get('.calendar-wrapper')
    cy.tick(10000)

    selectDate(6, 'MAR', 2020)
    assertMeeting('Test meeting 1', { start: '10:00-10:30pm', attendees: 3 })
    assertMeeting('Test meeting 2', { timeRange: '3:00-4:30pm', attendees: 2 })
    assertMeeting('Test meeting 3', { timeRange: '2:00-3:00am', attendees: 1 })
    assertMeeting('Test meeting 4', { timeRange: '2:00-3:00am', attendees: 1 })
    assertMeeting('Test meeting 5', { timeRange: '2:45-3:45am', attendees: 1 })

    cy.intercept('GET', '/4.0/meeting?**', {
      fixture: 'api/meeting/getListingRecurringShifted'
    })

    selectDate(10, 'MAR', 2020)
    cy.tick(10000)
    assertMeeting('Test meeting 1', {
      timeRange: '10:00-10:30pm',
      attendees: 3
    })
    assertMeeting('Test meeting 2', { timeRange: '3:00-4:30pm', attendees: 2 })
    assertMeeting('Test meeting 3', { timeRange: '2:00-3:00am', attendees: 1 })
    assertMeeting('Test meeting 4', { timeRange: '2:00-3:00am', attendees: 1 })
    assertMeeting('Test meeting 5', { timeRange: '2:45-3:45am', attendees: 1 })
  })

  it('Schedule shows properly with DST forward on day mode (New York)', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.intercept('GET', '/4.0/meeting?**', {
      fixture: 'api/meeting/getListingRecurringMarch'
    })
    cy.visit(`/schedule/view`)

    cy.get('.calendar-wrapper')
    cy.tick(10000)

    setViewMode('day')

    selectDate(4, 'MAR', 2020)
    assertMeeting('Test meeting 1', { start: '10:00-10:30pm', attendees: 3 })
    assertMeeting('Test meeting 3', { timeRange: '2:00-3:00am', attendees: 1 })

    cy.intercept('GET', '/4.0/meeting?**', {
      fixture: 'api/meeting/getListingRecurringShifted'
    })

    selectDate(11, 'MAR', 2020)
    assertMeeting('Test meeting 1', {
      timeRange: '10:00-10:30pm',
      attendees: 3
    })
    assertMeeting('Test meeting 3', { timeRange: '2:00-3:00am', attendees: 1 })
  })

  it('Clinic filter properly triggers a refresh', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/schedule/view`)

    cy.get('.calendar-wrapper')
    cy.tick(10000)

    cy.get('button').contains('Any Clinic').click({ force: true })
    cy.tick(1000)
    cy.wait(3000)
    cy.get('mat-dialog-container')
      .find('div.mat-select-trigger')
      .trigger('click', { force: true })
      .wait(500)
    cy.tick(1000)
    cy.get('mat-option').eq(0).click()
    cy.tick(1000)

    cy.get('mat-dialog-container')
      .find('button')
      .contains('Select')
      .click({ force: true })

    cy.wait('@getMeetingsRequest')
    cy.wait('@getMeetingsRequest')
    cy.wait('@getMeetingsRequest')

    cy.wait('@getMeetingsRequest').should((xhr) => {
      expect(xhr.request.url).to.contain('organization=1')
    })
  })

  it('Account filter properly triggers a refresh', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/schedule/view`)

    cy.get('.calendar-wrapper')
    cy.tick(10000)

    cy.get('button').contains('My Schedule').click({ force: true })
    cy.tick(1000)
    cy.get('mat-dialog-container')
    cy.tick(1000)
    cy.get('mat-dialog-container')
      .find('input[placeholder="Search Coach"]')
      .type('test')
    cy.tick(1000)
    cy.get('mat-option').eq(0).click({ force: true })
    cy.tick(1000)

    cy.wait('@getMeetingsRequest')
    cy.wait('@getMeetingsRequest')

    cy.wait('@getMeetingsRequest').should((xhr) => {
      expect(xhr.request.url).to.contain('account=1')
    })
  })

  it('Schedule property shows "Busy Time" meetings', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.intercept('GET', '/4.0/meeting?**', {
      fixture: 'api/meeting/getListingWithBusyTimes'
    })

    cy.visit(`/schedule/view`)

    cy.get('.calendar-wrapper')
    cy.tick(10000)
    assertMeeting('Busy Time', {
      timeRange: '10:00-10:30pm'
    })
  })

  it('Modal properly shows appropriately in ET (New York)', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/schedule/view`)

    cy.get('div.meeting.meeting-selectable').as('calendarBody')

    cy.get('@calendarBody').contains('Test meeting 1').click({ force: true })

    cy.get('div.mat-dialog-content').as('modalContent')

    cy.get('@modalContent').should('contain', 'Test meeting 1')
    cy.get('@modalContent').should('contain', 'Initial 1 on 1 meeting')
    cy.get('@modalContent').should('contain', '30 minutes')
    cy.get('@modalContent')
      .should('contain', 'Tue, Dec 31')
      .should('contain', 'at')
      .should('contain', '10:00 pm')
  })

  it('Modal properly shows time in AET (Australia Eastern)', function () {
    cy.setTimezone('aet')
    standardSetup()

    cy.visit(`/schedule/view`)

    cy.get('div.meeting.meeting-selectable').as('calendarBody')

    cy.get('@calendarBody').contains('Test meeting 1').click({ force: true })

    cy.get('div.mat-dialog-content').as('modalContent')

    cy.get('@modalContent').should('contain', 'Test meeting 1')
    cy.get('@modalContent').should('contain', 'Initial 1 on 1 meeting')
    cy.get('@modalContent').should('contain', '30 minutes')
    cy.get('@modalContent')
      .should('contain', 'Wed, Jan 1')
      .should('contain', 'at')
      .should('contain', '2:00 pm')
  })

  it('Modal allows meeting updating', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/schedule/view`)

    cy.get('div.meeting.meeting-selectable')
      .contains('Test meeting 1')
      .as('calendarBody')

    cy.get('@calendarBody').click({ force: true })

    cy.get('div.mat-dialog-content').as('modalContent')

    // click the 'edit' button
    cy.get('@modalContent').get('.ccr-button.mat-button').first().click()

    // click the 'save' button
    cy.get('@modalContent').get('.ccr-button.mat-button').first().click()

    // Yes, the value doesn't change since it's mocked
    cy.get('@modalContent').should('contain', 'Test meeting 1')

    // Wait for the modal to close, so it doesn't overlap to next test...
    cy.wait(5000)
  })
})
