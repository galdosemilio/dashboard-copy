import { standardSetup } from '../../../../support'

describe('Patient profile -> More -> Communications', function () {
  beforeEach(() => {
    standardSetup()
  })

  it('Should show the list of communications', function () {
    cy.visit(
      `/accounts/patients/${Cypress.env('clientId')}/settings;s=communications`
    )

    cy.get('mat-table').get('mat-row').as('interactionRows')

    cy.get('@interactionRows').should('have.length', 3)

    cy.get('@interactionRows')
      .eq(0)
      .should('contain', 'External Audio Call')
      .should('contain', 'Lascario Pacheco')
      .should('contain', 'CoachCare')
      .should('contain', '15 minutes')
      .should('contain', 'View Addendum')

    cy.get('@interactionRows')
      .eq(0)
      .find('button')
      .should('not.have.class', 'disabled')

    cy.get('@interactionRows')
      .eq(1)
      .should('contain', 'Platform Audio/Video Call')
      .should('contain', 'Lascario Pacheco')
      .should('contain', 'CoachCare')
      .should('contain', '33 minutes')

    cy.get('@interactionRows').eq(1).find('button').should('not.exist')

    cy.get('@interactionRows')
      .eq(2)
      .should('contain', 'Platform Audio/Video Call')
      .should('contain', 'Lascario Pacheco')
      .should('contain', 'CoachCare')
      .should('contain', '0 minutes')

    cy.get('@interactionRows').eq(2).find('button').should('not.exist')
  })

  it('Should show the addendum', function () {
    cy.visit(
      `/accounts/patients/${Cypress.env('clientId')}/settings;s=communications`
    )

    cy.get('mat-table').get('mat-row').as('interactionRows')

    cy.get('@interactionRows').should('have.length', 3)

    cy.get('@interactionRows')
      .eq(0)
      .find('span')
      .contains('View Addendum')
      .trigger('click', { force: true })

    cy.tick(10000)

    cy.get('mat-dialog-container')
      .should('contain', 'Test Account Test Account')
      .should('contain', 'Test Note')
  })

  describe('Allow a provider to add a manual communication', function () {
    beforeEach(() => {
      cy.visit(
        `/accounts/patients/${Cypress.env(
          'clientId'
        )}/settings;s=communications`
      )

      cy.get('mat-table').get('mat-row').as('interactionRows')

      cy.get('button')
        .contains('Add Manual Communication')
        .click({ force: true })
      cy.tick(1000)
    })

    it('selected date in the past', function () {
      cy.get('input[formcontrolname="date"]').click()
      cy.get('input[formcontrolname="textDate"]').type('12/30/2019')

      cy.tick(1000)

      clickStartTime()

      cy.get('.mat-clock-hours')
        .contains('7')
        .should('not.have.class', 'mat-clock-cell-disabled')

      clickOkAndCreate()

      cy.wait('@manualInteractionPostRequest').should((xhr) => {
        expect(xhr.request.body.billableService).to.equal(undefined)
        expect(xhr.request.body.participants).to.be.an('array')
        expect(xhr.request.body.type).to.equal('2')
        expect(xhr.request.body.range.start).to.contain('2019-12-30')
        expect(xhr.request.body.organization).to.equal('1')
      })
    })

    it('should not allow future time', function () {
      clickStartTime()

      cy.get('.mat-clock-hours')
        .contains('8')
        .should('have.class', 'mat-clock-cell-disabled')

      clickOkAndCreate()

      cy.wait('@manualInteractionPostRequest').should((xhr) => {
        expect(xhr.request.body.range.start).to.contain('2019-12-31')
      })
    })
  })
})

function clickStartTime() {
  cy.get('input[formcontrolname="startTime"]')
    .parent()
    .parent()
    .find('mat-datepicker-toggle')
    .click()
}

function clickOkAndCreate() {
  cy.get('mat-dialog-container')
    .find('button')
    .contains('OK')
    .click({ force: true })
  cy.tick(1000)

  cy.get('mat-dialog-container')
    .find('button')
    .contains('Create')
    .click({ force: true })
  cy.tick(1000)
}
