import { standardSetup } from '../../../support'

describe('Clinics -> Clinic -> Phases', function () {
  it('Properly displays the phases associated to the clinic', function () {
    standardSetup()

    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=phases`)

    cy.get('app-clinic-phases').find('mat-row').as('phaseRows')

    cy.get('@phaseRows').should('have.length', 3)

    cy.get('@phaseRows').eq(0).should('contain', '1')
    cy.get('@phaseRows').eq(0).should('contain', 'Package 1')

    cy.get('@phaseRows').eq(1).should('contain', '2')
    cy.get('@phaseRows').eq(1).should('contain', 'Package 2')

    cy.get('@phaseRows').eq(2).should('contain', '3')
    cy.get('@phaseRows').eq(2).should('contain', 'Package 3')
  })

  it('Prevents phase adding if the provider is not an admin', function () {
    standardSetup({
      apiOverrides: [
        {
          url: '/2.0/access/organization?**',
          fixture: 'api/organization/getAll-noadmin'
        }
      ]
    })

    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=phases`)

    cy.get('app-clinic-phases')
      .find('button')
      .contains('Add Phase')
      .parent()
      .should('be.disabled')
  })

  it('Properly displays the clinic information on the phase add dialog', function () {
    standardSetup()

    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=phases`)

    cy.get('app-clinic-phases')
      .find('button')
      .contains('Add Phase')
      .click({ force: true })

    cy.tick(1000)

    cy.get('mat-dialog-container')
      .should('contain', 'CoachCare')
      .should('contain', Cypress.env('clinicId'))
  })

  it('Allows the provider to add a phase association', function () {
    standardSetup()

    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=phases`)

    cy.get('app-clinic-phases')
      .find('button')
      .contains('Add Phase')
      .click({ force: true })

    cy.tick(1000)

    cy.get('mat-dialog-container')

    cy.tick(1000)

    cy.get('mat-dialog-container')
      .find('input[data-placeholder="Title"]')
      .type('test title')

    cy.get('mat-dialog-container')
      .find('textarea[data-placeholder="Description"]')
      .type('test description')

    cy.tick(1000)

    cy.get('mat-dialog-container')
      .find('button')
      .contains('Create')
      .click({ force: true })

    cy.wait('@packagePostRequest').should((xhr) => {
      expect(xhr.request.body.organization).to.equal('1')
      expect(xhr.request.body.title).to.equal('test title')
      expect(xhr.request.body.description).to.equal('test description')
    })

    cy.wait(2000)
  })

  it('Allows the provider to delete a phase association', function () {
    standardSetup()

    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=phases`)

    cy.get('app-clinic-phases').find('mat-row').as('phaseRows')

    cy.get('@phaseRows').eq(0).find('mat-icon').eq(0).click({ force: true })

    cy.tick(1000)

    cy.get('mat-dialog-container')
      .find('button')
      .contains('Yes')
      .click({ force: true })

    cy.wait('@packageOrganizationPatchRequest').should((xhr) => {
      expect(xhr.request.body.id).to.equal('1')
      expect(xhr.request.body.isActive).to.equal(false)
    })

    cy.wait(2000)
  })
})
