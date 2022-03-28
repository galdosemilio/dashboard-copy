import { standardSetup } from '../../../support'

describe('Patient Messages', function () {
  beforeEach(() => {
    cy.setOrganization('ccr')
    standardSetup({ mode: 'client' })
  })

  it('Should show a subset of the features', function () {
    cy.visit('/messages')

    cy.get('app-messages')
      .find('div.messages-header')
      .find('span')
      .contains('Eric Di Bari')
      .should('not.have.class', 'patient-link')

    cy.get('messages-recipients').should('not.exist')

    cy.get('app-messages').find('button').contains('Thread Information').click()
    cy.tick(1000)

    cy.get('messages-chat-info').find('ccr-user-card').as('userCards')

    cy.get('@userCards')
      .eq(0)
      .find('small')
      .should('not.have.class', 'patient-link')
  })
})
