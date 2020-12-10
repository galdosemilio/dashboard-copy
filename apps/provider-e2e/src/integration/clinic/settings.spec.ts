import { standardSetup } from '../../support'

describe('Clinics -> Clinic -> Settings', function () {
  beforeEach(() => {
    standardSetup()
  })

  it('Properly shows the clinic settings page', function () {
    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=settings`)

    cy.get('div.ccr-subcomponent').should('contain', 'Messaging Preferences')

    cy.get('[data-cy="org-settings-section-features-messages-autothread"]')
      .find('.mat-slide-toggle-input')
      .should('not.be.checked')
  })
})
