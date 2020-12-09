import { standardSetup } from '../../../support'

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
      .should('contain', 'Yes')

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
      .should('contain', 'No')

    cy.get('@interactionRows').eq(1).find('button').should('not.exist')

    cy.get('@interactionRows')
      .eq(2)
      .should('contain', 'Platform Audio/Video Call')
      .should('contain', 'Lascario Pacheco')
      .should('contain', 'CoachCare')
      .should('contain', '0 minutes')
      .should('contain', 'No')

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
      .find('button')
      .contains('open_in_new')
      .click({ force: true })

    cy.tick(1000)

    cy.get('mat-dialog-container')
      .should('contain', 'Test Account Test Account')
      .should('contain', 'Test Note')
  })

  it('Allow a provider to add a manual communication', function () {
    cy.visit(
      `/accounts/patients/${Cypress.env('clientId')}/settings;s=communications`
    )

    cy.get('mat-table').get('mat-row').as('interactionRows')

    cy.get('button').contains('Add Manual Communication').click({ force: true })
    cy.tick(1000)

    cy.wait(2000)

    cy.get('mat-dialog-container')
      .find('button')
      .contains('Create')
      .click({ force: true })
    cy.tick(1000)

    cy.wait('@manualInteractionPostRequest').should((xhr) => {
      expect(xhr.request.body.billableService).to.equal(undefined)
      expect(xhr.request.body.participants).to.be.an('array')
      expect(xhr.request.body.type).to.equal('2')
      expect(xhr.request.body.organization).to.equal('1')
    })
  })
})
