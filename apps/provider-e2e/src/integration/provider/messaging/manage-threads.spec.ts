import { standardSetup } from '../../../support'

describe('Messages -> Manage Threads', function () {
  beforeEach(() => {
    cy.setOrganization('ccr')
    cy.setTimezone('et')
    standardSetup()

    cy.visit('/messages')
  })

  it('Should allow a provider to add a member to the thread', function () {
    cy.get('div.messages-header')
      .find('mat-icon')
      .contains('info')
      .click({ force: true })

    cy.tick(1000)

    cy.get('messages-chat-info')
      .find('button')
      .contains('Add Member')
      .click({ force: true })

    cy.tick(1000)

    cy.get('mat-dialog-container')
      .find('input[data-placeholder="Select Patient or Coach"]')
      .type('a')

    cy.tick(1000)

    cy.get('mat-option').eq(0).click({ force: true })

    cy.tick(1000)

    cy.get('mat-dialog-container')
      .find('button')
      .contains('Add')
      .click({ force: true })

    cy.tick(1000)

    cy.wait('@threadMemberAddRequest').should((xhr) => {
      expect(xhr.request.body.accounts.length).to.equal(1)
      expect(xhr.request.body.accounts[0]).to.equal('1')
      expect(xhr.request.body.threadId).to.equal('1')
    })

    cy.get('ccr-user-card').should('have.length', 2)
  })

  it('Should allow a provider to remove a member from the thread', function () {
    cy.get('app-messages').find('mat-list-item').eq(1).click({ force: true })

    cy.tick(1000)

    cy.get('div.messages-header')
      .find('mat-icon')
      .contains('info')
      .click({ force: true })

    cy.tick(1000)

    cy.get('messages-chat-info')
      .find('mat-icon')
      .contains('delete')
      .eq(0)
      .click({ force: true })

    cy.tick(1000)

    cy.get('mat-dialog-container')
      .find('button')
      .contains('Remove Member')
      .click({ force: true })

    cy.tick(1000)

    cy.wait('@threadMemberUpdateRequest').should((xhr) => {
      expect(xhr.request.body.account).to.equal('6')
      expect(xhr.request.body.threadId).to.equal('2')
      expect(xhr.request.body.isActive).to.equal(false)
    })

    cy.get('messages-chat-info').find('ccr-user-card').should('have.length', 2)
  })

  it('Prevents a provider from removing a member if there are 2 members or less', function () {
    cy.get('div.messages-header')
      .find('mat-icon')
      .contains('info')
      .click({ force: true })

    cy.tick(1000)

    cy.get('ccr-user-card').should('have.length', 1)

    cy.tick(1000)

    cy.get('messages-chat-info')
      .find('mat-icon')
      .contains('delete')
      .should('have.class', 'disabled')
  })
})
