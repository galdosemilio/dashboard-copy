import { standardSetup } from '../../support'

describe('Other coach profile -> Communications', function () {
  beforeEach(() => {
    standardSetup()
  })

  it('Should show the list of communications', function () {
    cy.visit(
      `/accounts/coaches/${Cypress.env('providerIdOther')};s=communications`
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
    cy.visit(
      `/accounts/coaches/${Cypress.env('providerIdOther')};s=communications`
    )

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
