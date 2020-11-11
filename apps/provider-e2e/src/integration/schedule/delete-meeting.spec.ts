import { standardSetup } from '../../support'

type Option =
  | 'schedule-delete-this-meeting'
  | 'schedule-delete-this-and-future'
  | 'schedule-delete-after'

describe('Schedule -> delete meeting', function () {
  it('List View -> Single meeting delete', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/schedule/list`)

    // Get the last available delete button
    cy.get('[data-cy="schedule-listing-meeting-delete"]')
      .last()
      .as('meetingDeleteButton')

    // Open delete modal, and verify content
    cy.get('@meetingDeleteButton').click()
    cy.get('mat-dialog-container').as('modalContent')
    cy.get('@modalContent').contains(
      'Are you sure you want to delete this meeting?'
    )
    cy.get('@modalContent').contains('This action cannot be undone.')

    // click the 'yes' button to delete
    cy.get('@modalContent').get('button').contains('Yes').click({ force: true })

    cy.tick(1000)

    // check that delete call was made for single meeting with meeting id meetingId (id is last meeting id from meeting/getListing.json fixture)
    cy.wait('@deleteMeeting')
      .its('url')
      .should('equal', 'https://api.coachcaredev.com/2.0/meeting/single/18073')

    // The modal should be closed. The table behind is not updated since the listing is mocked.
    cy.get('.mat-dialog-content').should('not.exist')
  })

  it('Calendar View -> Single meeting delete', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/schedule/view`)

    cy.get('div.meeting.meeting-selectable')
      .contains('Test meeting 1')
      .as('calendarBody')

    cy.get('@calendarBody').click({ force: true })

    cy.get('div.mat-dialog-content').as('modalContent')

    cy.wait(2000)
    // click the 'delete' button
    cy.get('@modalContent')
      .get('.ccr-button.mat-button')
      .contains('Delete')
      .click()

    cy.tick(1000)

    // click the 'yes' button
    cy.get('@modalContent').get('button').contains('Yes').click({ force: true })

    cy.tick(1000)

    // Thne modal should be closed. The table behind is not updated since the listing is mocked.
    cy.get('.mat-dialog-content', { timeout: 10000 }).should('not.exist')
  })

  it('List View -> Recurring meeting delete: delete this meeting only', function () {
    listViewRecurringMeeting('schedule-delete-this-meeting')
  })

  it('List View -> Recurring meeting delete: delete this and future meetings', function () {
    listViewRecurringMeeting('schedule-delete-this-and-future')
  })

  it('List View -> Recurring meeting delete: delete after', function () {
    listViewRecurringMeeting('schedule-delete-after')
  })

  it('Calendar View -> Recurring meeting delete: delete this meeting only', function () {
    calendarViewRecurringMeeting('schedule-delete-this-meeting')
  })

  it('Calendar View -> Recurring meeting delete: delete this and future meetings', function () {
    calendarViewRecurringMeeting('schedule-delete-this-and-future')
  })

  it('Calendar View -> Recurring meeting delete: delete after', function () {
    calendarViewRecurringMeeting('schedule-delete-after')
  })
})

function listViewRecurringMeeting(option: Option): void {
  cy.setTimezone('et')
  standardSetup(undefined, [
    {
      url: '/3.0/meeting?**',
      fixture: 'fixture:/api/meeting/getListingRecurring'
    },
    {
      url: '/3.0/meeting/**',
      fixture: 'fixture:/api/meeting/getSingleRecurring'
    }
  ])

  cy.visit(`/schedule/list`)

  // Get the last available delete button
  cy.get('[data-cy="schedule-listing-meeting-delete"]')
    .last()
    .as('meetingDeleteButton')

  // Open delete modal, and verify content
  cy.get('@meetingDeleteButton').click()
  cy.get('mat-dialog-content').as('modalContent')
  cy.get('@modalContent').contains(
    'Are you sure you want to delete this meeting?'
  )
  cy.get('@modalContent').contains('This action cannot be undone.')
  cy.get('@modalContent').contains('Delete this meeting only')
  cy.get('@modalContent').contains('Delete this and all future meetings')
  cy.get('@modalContent').contains('Delete future meetings after:')

  // Select 'only this meeting' and delete
  cy.tick(10000)
  cy.get(`[data-cy="${option}"]`).click().wait(300)

  cy.get('@modalContent')
    .get('button')
    .contains('Delete')
    .click({ force: true })

  verifyDeleteApiCall(option)
  cy.get('@modalContent').should('not.exist')
}

function calendarViewRecurringMeeting(option: Option): void {
  cy.setTimezone('et')
  standardSetup(undefined, [
    {
      url: '/3.0/meeting?**',
      fixture: 'fixture:/api/meeting/getListingRecurring'
    },
    {
      url: '/3.0/meeting/**',
      fixture: 'fixture:/api/meeting/getSingleRecurring'
    }
  ])

  cy.visit(`/schedule/view`)

  // Open calendar info and go to delete modal
  cy.get('div.meeting.meeting-selectable')
    .contains('Test meeting 5')
    .as('calendarBody')
  cy.get('@calendarBody').click({ force: true })
  cy.get('app-view-meeting-dialog').as('modalContent')

  // Verify delete modal
  cy.get('@modalContent')
    .get('.ccr-button.mat-button')
    .contains('Delete')
    .click()

  cy.tick(1000)
  cy.get('@modalContent').contains(
    'Are you sure you want to delete this meeting?'
  )
  cy.get('@modalContent').contains('This action cannot be undone.')
  cy.get('@modalContent').contains('Delete this meeting only')
  cy.get('@modalContent').contains('Delete this and all future meetings')
  cy.get('@modalContent').contains('Delete future meetings after:')

  // Select 'only this meeting' and delete
  cy.tick(10000)
  cy.get(`[data-cy="${option}"]`).click().wait(300)

  cy.get('@modalContent')
    .get('button')
    .contains('Delete')
    .click({ force: true })

  verifyDeleteApiCall(option)

  // The modal should be closed. The table behind is not updated since the listing is mocked.
  cy.get('@modalContent').should('not.exist')
}

function verifyDeleteApiCall(option: Option): void {
  // check that delete call was made for single meeting with meeting id meetingId (id is last meeting id from meeting/getListing.json fixture)

  let url

  switch (option) {
    case 'schedule-delete-after':
      url =
        'https://api.coachcaredev.com/2.0/meeting/recurring/18073?after=2019-12-31T05:00:00.000Z'
      break
    case 'schedule-delete-this-and-future':
      url = 'https://api.coachcaredev.com/2.0/meeting/recurring/18073'
      break
    case 'schedule-delete-this-meeting':
      url = 'https://api.coachcaredev.com/2.0/meeting/single/18073'
      break
  }

  cy.tick(1000)

  cy.wait('@deleteMeeting').its('url').should('equal', url)
}
