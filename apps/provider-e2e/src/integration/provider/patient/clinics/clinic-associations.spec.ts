import { standardSetup } from './../../../../support'

describe('Patient profile -> clinics', function () {
  beforeEach(() => {
    cy.setTimezone('et')
    standardSetup({
      apiOverrides: [
        {
          url: '/1.0/rpm/state**',
          fixture: 'api/rpm/rpmStateEnabledEntries'
        }
      ]
    })
  })

  it('Clinics associations exist for patient, and show correctly', function () {
    cy.visit(
      `/accounts/patients/${Cypress.env('clientId')}/settings;s=associations`
    )

    cy.get('app-dieter-settings')
      .find('li')
      .contains('Clinics')
      .should('have.length', 1)

    cy.get('ccr-account-associations').find('mat-row').as('clinicRows')

    cy.get('@clinicRows').eq(0).should('contain', 'CoachCare')

    cy.get('@clinicRows')
      .eq(1)
      .should('contain', 'Center for Medical Weight Loss')
  })

  it('Clinics associations can be added for patient', function () {
    cy.visit(
      `/accounts/patients/${Cypress.env('clientId')}/settings;s=associations`
    )

    cy.get('ccr-account-associations')
      .find('button')
      .contains('Add Clinic Association')
      .should('have.length', 1)
      .trigger('click')
      .wait(300)

    cy.get('mat-dialog-container').find('mat-select').trigger('click').wait(300)

    cy.get('.cdk-overlay-container').find('mat-option').as('clinicOptions')

    cy.get('@clinicOptions').eq(0).should('contain', 'No Clinics')

    cy.get('@clinicOptions').eq(1).should('contain', 'CoachCare')

    cy.get('@clinicOptions')
      .eq(2)
      .should('contain', 'Center for Medical Weight Loss')

    cy.get('@clinicOptions').eq(3).should('contain', 'MDTeam')

    cy.get('@clinicOptions').eq(4).should('contain', 'inHealth')
  })

  it('Deletable clinics associations limited to only "admin" permissioned clinic', function () {
    cy.intercept('GET', '/2.0/access/organization?**', {
      fixture: 'api/organization/getAll-noadmin'
    })

    cy.visit(
      `/accounts/patients/${Cypress.env('clientId')}/settings;s=associations`
    )

    cy.get('app-dieter-settings')
      .find('li')
      .contains('Clinics')
      .should('have.length', 1)

    cy.get('ccr-account-associations').find('mat-row').as('clinicRows')

    cy.get('@clinicRows')
      .eq(0)
      .find('mat-icon')
      .should('have.class', 'disabled')

    cy.get('@clinicRows')
      .eq(1)
      .find('mat-icon')
      .should('have.class', 'disabled')
  })

  it('Cannot add association if no "admin" permissioned clinics', function () {
    cy.intercept('GET', '/2.0/access/organization?**', {
      fixture: 'api/organization/getAll-noadmin'
    })
    cy.intercept('GET', '/2.0/access/organization?account=**', {
      fixture: 'api/general/emptyDataEmptyPagination'
    })

    cy.visit(
      `/accounts/patients/${Cypress.env('clientId')}/settings;s=associations`
    )

    cy.get('ccr-account-associations')
      .find('button')
      .should('have.attr', 'disabled')
      .wait(2000)
  })

  it('Properly shows the current RPM session (if enabled)', function () {
    cy.visit(
      `/accounts/patients/${Cypress.env('clientId')}/settings;s=associations`
    )

    cy.get('ccr-account-associations').find('mat-row').as('clinicRows')

    cy.get('@clinicRows').eq(0).find('mat-icon').contains('delete').click()

    cy.tick(1000)

    cy.get('mat-dialog-container').should('contain', 'RPM')

    cy.get('mat-dialog-container').should('contain', 'RPM enabled by')
    cy.get('mat-dialog-container').should('contain', 'Eric Di Bari')
    cy.get('mat-dialog-container').should('contain', 'eric@websprout.org')

    cy.get('mat-dialog-container').find('button').contains('Yes').click()
    cy.tick(1000)
    cy.get('mat-dialog-container').find('button').contains('Continue').click()

    cy.tick(1000)

    cy.wait('@clinicAssociationDeleteRequest').should((xhr) => {
      expect(xhr.request.url).to.contain(Cypress.env('clientId'))
      expect(xhr.request.url).to.contain(Cypress.env('organizationId'))
    })
  })

  it('Properly shows the Inaccessible Coach message in the RPM session', function () {
    cy.visit(
      `/accounts/patients/${Cypress.env('clientId')}/settings;s=associations`
    )

    cy.get('ccr-account-associations').find('mat-row').as('clinicRows')

    cy.get('@clinicRows').eq(0).find('mat-icon').contains('delete').click()

    cy.intercept('GET', `/2.0/account/${Cypress.env('providerId')}`, {
      statusCode: 403,
      body: {}
    })

    cy.tick(1000)

    cy.get('mat-dialog-container').should('contain', 'RPM')

    cy.get('mat-dialog-container').should('contain', 'Inaccessible Coach')

    cy.get('mat-dialog-container').find('button').contains('Yes').click()
    cy.tick(1000)
    cy.get('mat-dialog-container').find('button').contains('Continue').click()

    cy.tick(1000)

    cy.wait('@clinicAssociationDeleteRequest').should((xhr) => {
      expect(xhr.request.url).to.contain(Cypress.env('clientId'))
      expect(xhr.request.url).to.contain(Cypress.env('organizationId'))
    })
  })
})
