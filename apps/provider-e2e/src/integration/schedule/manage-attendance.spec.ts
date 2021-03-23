import { standardSetup } from '../../support'

describe('Schedule -> manage attendance', function () {
  it('Modal allows attendance to be viewed and udpated', function () {
    standardSetup(Date.UTC(2020, 0, 2))

    cy.visit(`/schedule/view`)

    cy.get('div.meeting.meeting-selectable')
      .contains('Test meeting 1')
      .as('calendarBody')

    cy.get('@calendarBody').click()

    cy.wait(5000)

    cy.get('.attendanceSelector').as('attendanceSelectors')

    cy.get('@attendanceSelectors').should('have.length', 3)

    cy.get('@attendanceSelectors').eq(0).contains('Attended')

    cy.get('@attendanceSelectors').eq(0).trigger('click')

    cy.get('.mat-option').as('attendanceOptions')

    cy.get('@attendanceOptions').should('have.length', 4)

    // // Mark as attended
    cy.intercept('PATCH', `/3.0/meeting/attendance`, (request) => {
      expect(request.body.id).to.contain('2')
      expect(request.body.status).to.equal('3')
      request.reply({})
    })

    cy.get('@attendanceOptions').eq(0).trigger('click').wait(1200)

    // // Mark as not attended
    cy.intercept('PATCH', `/3.0/meeting/attendance`, (request) => {
      expect(request.body.id).to.contain('2')
      expect(request.body.status).to.equal('2')
      request.reply({})
    })
    cy.get('@attendanceSelectors').eq(1).trigger('click')
    cy.get('.mat-select-panel')
      .find('mat-option')
      .eq(1)
      .trigger('click', { force: true })

    // // Wait for the modal to close, so it doesn't overlap to next test...
    cy.wait(5000)
  })
})
