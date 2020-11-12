import { standardSetup } from '../../../support'
import { deleteNote } from './utils'

describe('Patient profile -> notes', function () {
  it('Notes section shows in side bar with three notes in New York ET', function () {
    cy.setOrganization('ccr')
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    // Main buttons
    cy.get('app-rightpanel-reminders').as('rightMenu')
    cy.get('@rightMenu').find('h4').should('contain', 'Notes')
    cy.get('@rightMenu').find('button').should('contain', 'Add New Note')

    cy.get('@rightMenu').find('.note-container').as('noteEntries')

    cy.get('@noteEntries').should('have.length', 3)

    cy.get('@noteEntries').eq(0).should('contain', 'Tue, Dec 31, 2019')
    cy.get('@noteEntries').eq(0).should('contain', 'CoachCare (ID 1)')
    cy.get('@noteEntries').eq(1).should('contain', 'Tue, Dec 31, 2019')
    cy.get('@noteEntries').eq(1).should('contain', 'CoachCare (ID 1)')
    cy.get('@noteEntries').eq(2).should('contain', 'Wed, Jan 1, 2020')
    cy.get('@noteEntries').eq(2).should('contain', 'CoachCare (ID 1)')
  })

  it('Notes section shows in side bar with three notes in Australia AET', function () {
    cy.setOrganization('ccr')
    cy.setTimezone('aet')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    // Main buttons
    cy.get('app-rightpanel-reminders').as('rightMenu')
    cy.get('@rightMenu').find('h4').should('contain', 'Notes')
    cy.get('@rightMenu').find('button').should('contain', 'Add New Note')

    cy.get('@rightMenu').find('.note-container').as('noteEntries')

    cy.get('@noteEntries').should('have.length', 3)

    cy.get('@noteEntries').eq(0).should('contain', 'Wed, Jan 1, 2020')
    cy.get('@noteEntries').eq(0).should('contain', 'CoachCare (ID 1)')
    cy.get('@noteEntries').eq(1).should('contain', 'Wed, Jan 1, 2020')
    cy.get('@noteEntries').eq(1).should('contain', 'CoachCare (ID 1)')
    cy.get('@noteEntries').eq(2).should('contain', 'Thu, Jan 2, 2020')
    cy.get('@noteEntries').eq(2).should('contain', 'CoachCare (ID 1)')
  })

  it('Notes section modal submits for proper form id', function () {
    cy.setOrganization('ccr')
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    cy.get('app-rightpanel-reminders')
      .find('button')
      .contains('Add New Note')
      .trigger('click')

    cy.get('add-note-dialog').find('textarea').type('this is a test')

    cy.route({
      method: 'POST',
      url: `/1.0/content/form/submission`,
      onRequest: (xhr) => {
        expect(xhr.request.body.account).to.equal('3')
        expect(xhr.request.body.answers[0].response.value).to.equal(
          'this is a test'
        )
        expect(xhr.request.body.form).to.equal('15081')
        expect(xhr.request.body.submittedBy).to.equal('1')
        expect(xhr.request.body.organization).to.equal('1')
      },
      status: 200,
      response: {}
    })

    cy.get('add-note-dialog').find('button').contains('Save').trigger('click')
  })

  it('Notes section modal deletes the appropriate submission id', function () {
    cy.setOrganization('ccr')
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    deleteNote('Not too much to say here 1...')

    cy.wait('@formSubmissionDeleteRequest').should((xhr) => {
      expect(xhr.url).to.contain('/submission/1')
    })
  })
})
