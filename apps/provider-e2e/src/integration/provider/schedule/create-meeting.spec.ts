import { standardSetup } from '../../../support'
import { selectOption } from '../../helpers'

describe('Schedule -> create meeting', function () {
  it('Can create a meeting', function () {
    cy.setOrganization('ccr')
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/schedule/view`)

    cy.get('.calendar-wrapper').should('exist')

    cy.tick(1000)

    cy.get('app-consultation')
      .find('input[data-placeholder="Title"]')
      .type('meeting title')

    cy.intercept('POST', `/2.0/meeting`, (request) => {
      expect(request.body.title).to.contain('meeting title')
      expect(request.body.location.streetAddress).to.contain(
        '150 West 28th Street'
      )
      expect(request.body.skipConflictCheck).to.equal(false)
      expect(request.body.location.city).to.contain('New York')
      expect(request.body.location.postalCode).to.contain('10001')
      expect(request.body.location.state).to.contain('NY')
      expect(request.body.location.country).to.contain('US')
      expect(request.body.timezone).to.equal('America/New_York')
      expect(request.body.startTime).to.equal('2019-12-31T19:15:00-05:00')
      expect(request.body.endTime).to.equal('2019-12-31T19:30:00-05:00')
      request.reply({})
    })

    cy.get('app-consultation')
      .find('a')
      .contains('Save Meeting')
      .trigger('click')
  })

  it('Properly sets the conflict check flag in the meeting', function () {
    cy.setOrganization('ccr')
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/schedule/view`)

    cy.get('.calendar-wrapper').should('exist')

    cy.tick(1000)

    cy.get('app-consultation')
      .find('input[data-placeholder="Title"]')
      .type('conflicting meeting title')

    selectOption(
      cy
        .get('app-consultation')
        .find('mat-select[ng-reflect-placeholder="Repeat"]'),
      'Every Week'
    )

    cy.get('app-consultation').find('mat-checkbox').click()

    cy.tick(1000)

    cy.intercept('POST', `/2.0/meeting`, (request) => {
      expect(request.body.title).to.contain('conflicting meeting title')
      expect(request.body.skipConflictCheck).to.equal(true)
      request.reply({})
    })

    cy.get('app-consultation')
      .find('a')
      .contains('Save Meeting')
      .trigger('click')
  })
})
