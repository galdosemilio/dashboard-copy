import { standardSetup } from '../../../support'

describe('Clinics -> Clinic -> Settings', function () {
  it('Properly shows the clinic settings page', function () {
    standardSetup()

    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=settings`)

    cy.get(
      '[data-cy="org-settings-section-features-messages-autothread"'
    ).should(
      'contain',
      'Automatically add selected coaches to all message threads in this clinic'
    )

    cy.wait(2000)
  })

  it('If not admin, shows admin warning and disables preference', function () {
    standardSetup({
      apiOverrides: [
        {
          url: '/2.0/access/organization?**',
          fixture: 'api/organization/getAll-noadmin'
        }
      ]
    })

    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=settings`)

    cy.get('[data-cy="adminPermissionRequired"').should('be.visible')

    cy.get('[data-cy="org-settings-section-features-messages-autothread"]')
      .find('.mat-slide-toggle-input')
      .should('have.attr', 'disabled')

    cy.wait(2000)
  })

  it('If admin only, hides admin warning and enables preference', function () {
    standardSetup({
      apiOverrides: [
        {
          url: '/2.0/access/organization?**',
          fixture: 'api/organization/getAll-onlyadmin'
        }
      ]
    })

    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=settings`)

    cy.get('[data-cy="adminPermissionRequired"').should('not.exist')

    cy.get('app-clinic-settings')

    cy.tick(10000)

    cy.get('[data-cy="org-settings-section-features-messages-autothread"]')
      .find('.mat-slide-toggle-input')
      .should('not.have.attr', 'disabled')

    cy.wait(2000)
  })

  it('If full permission, hides admin warning and enables preference', function () {
    standardSetup({
      apiOverrides: [
        {
          url: '/2.0/access/organization?**',
          fixture: 'api/organization/getAll'
        }
      ]
    })

    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=settings`)

    cy.get('app-clinic-settings')

    cy.tick(10000)

    cy.get('[data-cy="adminPermissionRequired"').should('not.exist')

    cy.get('[data-cy="org-settings-section-features-messages-autothread"]')
      .find('.mat-slide-toggle-input')
      .should('not.have.attr', 'disabled')

    cy.wait(2000)
  })
})
