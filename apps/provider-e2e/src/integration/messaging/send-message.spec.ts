import { standardSetup } from '../../support'

describe('Messages -> send message', function () {
  it('message can be send using enter key', function () {
    cy.setOrganization('ccr')
    cy.setTimezone('et')
    standardSetup()

    cy.intercept('POST', `/2.0/message`, (request) => {
      expect(request.body.content).to.contain('this is a test')
      expect(request.body.subject).to.contain('CoachCare Message')
      expect(request.body.threadId).to.contain('1')
      request.reply({})
    })

    cy.visit(`/messages`)

    cy.get('ccr-messages')
      .find('textarea')
      .type('this is a test')
      .type('{enter}')
  })

  it('message can be send using mouse click', function () {
    cy.setOrganization('ccr')
    cy.setTimezone('et')
    standardSetup()

    cy.intercept('POST', `/2.0/message`, (request) => {
      expect(request.body.content).to.contain('this is a test')
      expect(request.body.subject).to.contain('CoachCare Message')
      expect(request.body.threadId).to.contain('1')
      request.reply({})
    })

    cy.visit(`/messages`)

    cy.get('ccr-messages').find('textarea').type('this is a test')

    cy.get('ccr-messages').find('button').contains('Send').trigger('click')
  })

  it('message sending enter key is supressed if "shift" key is being held', function () {
    cy.setOrganization('ccr')
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/messages`)

    cy.get('ccr-messages')
      .find('textarea')
      .type('this is a test')
      .type('{shift}{enter}')
      .type('{shift}{enter}')
      .type('next line')
      .should('have.value', 'this is a test\n\nnext line')
  })
})
