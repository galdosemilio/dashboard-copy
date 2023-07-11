import { standardSetup } from '../../../../support'

describe('Reports -> Communications -> Interactions', function () {
  beforeEach(() => {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/reports/communications/communications`)
  })

  it('Time range selector shows this month and correct start and end dates by default, and show previous month correctly when clicked', function () {
    cy.get('app-quick-date-range').contains('This Month')
    cy.get('[data-cy="date-range-picker-start"]').contains('1 Dec 2019')
    cy.get('[data-cy="date-range-picker-end"]').contains('31 Dec 2019')

    cy.tick(1000)

    cy.get('[data-cy="date-ranger-picker-left-click"]').trigger('click')

    cy.tick(1000)

    cy.get('[data-cy="date-range-picker-start"]').contains('1 Nov 2019')
    cy.get('[data-cy="date-range-picker-end"]').contains('30 Nov 2019')
  })

  it('Shows call history for selected organization in ET', function () {
    cy.get('[data-cy="callLogClinicNotice"]').should(
      'contain',
      'CoachCare (ID: 1)'
    )
    cy.get('[data-cy="callLogTable"]').as('callTable')

    cy.get('mat-table').get('mat-row').as('interactionRows')

    cy.get('@interactionRows').should('have.length', 3)

    cy.get('@interactionRows')
      .eq(0)
      .should('contain', 'External Audio Call')
      .should('contain', 'Lascario Pacheco')
      .should('contain', 'CoachCare')
      .should('contain', '15 minutes')

    cy.get('@interactionRows')
      .eq(1)
      .should('contain', 'Platform Audio/Video Call')
      .should('contain', 'Lascario Pacheco')
      .should('contain', 'CoachCare')
      .should('contain', '33 minutes')

    cy.get('@interactionRows')
      .eq(2)
      .should('contain', 'Platform Audio/Video Call')
      .should('contain', 'Lascario Pacheco')
      .should('contain', 'CoachCare')
      .should('contain', '0 minutes')
  })

  it('Should show the addendum', function () {
    cy.get('mat-table').get('mat-row').as('interactionRows')

    cy.get('@interactionRows').should('have.length', 3)

    cy.get('@interactionRows')
      .eq(0)
      .find('span')
      .contains('View Addendum')
      .trigger('click', { force: true })

    cy.tick(1000)

    cy.get('mat-dialog-container')
      .should('contain', 'Test Account Test Account')
      .should('contain', 'Test Note')
  })
})
