import { standardSetup } from '../../support'

describe('Messages -> basic message page layout is correct', function () {
  it('View layout and thread in ET (New York)', function () {
    cy.setOrganization('ccr')
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/messages`)

    cy.get('app-messages-recipients').find('input').as('searchRecipients')

    cy.get('@searchRecipients').should('have.value', '')

    cy.get('ccr-messages').find('.message-wrap').as('messageContainers')

    cy.get('@messageContainers').should('have.length', 2)

    cy.get('ccr-messages').find('.message-heading').as('timestamps')

    cy.get('@timestamps')
      .eq(0)
      .should('contain', 'Thursday, Dec 19, 2019, 10:00 pm')
    cy.get('@timestamps').eq(1).should('contain', 'in 3 hours')

    cy.get('ccr-messages')
      .find('.message-wrap')
      .last()
      .find('a')
      .should('have.length', 5)
  })

  it('View layout and thread in AET (Australia Eastern)', function () {
    cy.setOrganization('ccr')
    cy.setTimezone('aet')
    standardSetup()

    cy.visit(`/messages`)

    cy.get('app-messages-recipients').find('input').as('searchRecipients')

    cy.get('@searchRecipients').should('have.value', '')

    cy.get('ccr-messages').find('.message-wrap').as('messageContainers')

    cy.get('@messageContainers').should('have.length', 2)

    cy.get('ccr-messages').find('.message-heading').as('timestamps')

    cy.get('@timestamps')
      .eq(0)
      .should('contain', 'Friday, Dec 20, 2019, 2:00 pm')
    cy.get('@timestamps').eq(1).should('contain', 'in 3 hours')

    cy.get('ccr-messages')
      .find('.message-wrap')
      .last()
      .find('a')
      .should('have.length', 5)
  })

  it('Allows marking all threads as read', function () {
    cy.setOrganization('ccr')
    cy.setTimezone('et')
    standardSetup(undefined, [
      {
        url: '/2.0/message/unread',
        fixture: 'fixture:/api/message/getUnread'
      }
    ])

    cy.visit(`/messages`)

    cy.get('div.ccr-recipients')
      .find('button')
      .contains('Mark all messages as read')
      .click({ force: true })

    cy.tick(1000)

    cy.get('mat-dialog-container')
      .find('button')
      .contains('Yes')
      .click({ force: true })

    cy.tick(1000)

    cy.wait('@threadMarkAsViewedRequest')
  })

  it('Mark all threads as read button only appears if there are unread threads', function () {
    cy.setOrganization('ccr')
    cy.setTimezone('aet')
    standardSetup()

    cy.visit(`/messages`)

    cy.get('div.ccr-recipients')

    cy.get('button').contains('Mark all messages as read').should('not.exist')
  })
})
