import { standardSetup } from '../../../../support'
import { ApiOverrideEntry } from '../../../../support/api'
import { deleteNote } from './utils'

describe('Patient profile -> notes', function () {
  it('Notes section shows in side bar with three notes in New York ET', function () {
    checkNotes('et', Cypress.env('clientId'), undefined, [
      { date: 'Tue, Dec 31, 2019', value: 'CoachCare (ID 1)' },
      { date: 'Tue, Dec 31, 2019', value: 'CoachCare (ID 1)' },
      { date: 'Wed, Jan 1, 2020', value: 'CoachCare (ID 1)' }
    ])
  })

  it('Notes section not showing in different patient', function () {
    checkNotes('et', '1', [
      {
        url: '/1.0/content/form/submission?**',
        fixture: 'api/general/emptyDataEmptyPagination'
      }
    ])
  })

  it('Notes section shows in side bar with three notes in Australia AET', function () {
    checkNotes('aet', Cypress.env('clientId'), undefined, [
      { date: 'Wed, Jan 1, 2020', value: 'CoachCare (ID 1)' },
      { date: 'Wed, Jan 1, 2020', value: 'CoachCare (ID 1)' },
      { date: 'Thu, Jan 2, 2020', value: 'CoachCare (ID 1)' }
    ])
  })

  it('Notes section modal submits for proper form id', function () {
    cy.setOrganization('ccr')
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    cy.get('app-dieter-dashboard')
    cy.tick(10000)

    cy.get('app-rightpanel-reminders')
      .find('button')
      .contains('Add New Note')
      .trigger('click')

    cy.get('add-note-dialog')
      .find('textarea')
      .should('be.enabled')
      .should('be.visible')
    cy.get('add-note-dialog').find('textarea').type('this is a test')

    cy.get('add-note-dialog')
      .find('button')
      .contains('Save')
      .parent()
      .should('be.enabled')
      .click()

    cy.wait('@formSubmit').should((xhr) => {
      expect(xhr.request.body.account).to.equal('3')
      expect(xhr.request.body.answers[0].response.value).to.equal(
        'this is a test'
      )
      expect(xhr.request.body.form).to.equal('4')
      expect(xhr.request.body.submittedBy).to.equal(1)
      expect(xhr.request.body.organization).to.equal('1')
    })
  })

  it('Notes section modal deletes the appropriate submission id', function () {
    cy.setOrganization('ccr')
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    cy.get('app-dieter-dashboard')
    cy.tick(10000)

    deleteNote('Not too much to say here 1...')

    cy.wait('@formSubmissionDeleteRequest').should((xhr) => {
      expect(xhr.request.url).to.contain('/submission/1')
    })
  })
})

const checkNotes = (
  tz: string,
  clientId,
  apiOverrides?: ApiOverrideEntry[],
  notes?: Array<{
    date: string
    value: string
  }>
) => {
  cy.setOrganization('ccr')
  cy.setTimezone(tz)
  standardSetup({
    apiOverrides
  })

  cy.visit(`/accounts/patients/${clientId}/dashboard`)

  cy.get('app-dieter-dashboard')
  cy.tick(10000)

  // Main buttons
  cy.get('app-rightpanel-reminders').as('rightMenu')
  cy.get('@rightMenu').find('h4').should('contain', 'Notes')
  cy.get('@rightMenu').find('button').should('contain', 'Add New Note')

  if (!notes) {
    cy.get('@rightMenu').find('.empty-container').should('exist')
    cy.get('@rightMenu').find('.note-container').should('not.exist')
  } else {
    cy.get('@rightMenu').find('.note-container').as('noteEntries')

    cy.get('@noteEntries').should('have.length', notes.length)

    for (let i = 0; i < notes.length; i += 1) {
      cy.get('@noteEntries').eq(i).should('contain', notes[i].date)
      cy.get('@noteEntries').eq(i).should('contain', notes[i].value)
    }
  }
}
