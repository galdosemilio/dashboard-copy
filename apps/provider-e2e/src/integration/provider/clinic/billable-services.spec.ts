import { standardSetup } from '../../../support'

describe('Clinics -> Clinic -> Billable Services', function () {
  it('Should properly display inherited billable services settings', function () {
    standardSetup({
      apiOverrides: [
        {
          url: '/1.0/rpm/preference/organization?organization=**',
          fixture: 'api/rpm/getOrgPreferenceInherited'
        },
        {
          url: '1.0/care-management/supervising-provider?**',
          fixture: 'api/rpm/supervisingProvidersInherited'
        }
      ]
    })

    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=billable-services`)

    cy.get('app-clinic-billable-services')

    cy.tick(1000)

    cy.get('input[data-placeholder="##-#######"]').should(
      'have.value',
      '98-7654321'
    )
    cy.get('app-clinic-billable-services').should(
      'contain',
      'This TIN is inherited from'
    )
    cy.get('tbody')
      .find('tr')
      .eq(0)
      .should('contain', '7357')
      .should('contain', 'Inherited Test Coach')
    cy.get('app-clinic-billable-services').should(
      'contain',
      'This Supervising Providers listing is inherited from'
    )
  })

  it('Should properly display own billable services settings', function () {
    standardSetup()
    cy.intercept('GET', '/1.0/care-management/preference/organization?**', {
      statusCode: 200,
      body: {
        data: [
          {
            id: '1',
            organization: {
              id: '1'
            },
            taxIdentificationNumber: '123456789',
            isActive: true
          }
        ]
      }
    })

    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=billable-services`)

    cy.get('app-clinic-billable-services')

    cy.tick(1000)

    cy.get('input[data-placeholder="##-#######"]').should(
      'have.value',
      '123456789'
    )
    cy.get('app-clinic-billable-services').should(
      'not.contain',
      'This TIN is inherited from'
    )
    cy.get('tbody')
      .find('tr')
      .eq(0)
      .should('contain', '7357')
      .should('contain', 'Test')
      .should('contain', 'Coach')
    cy.get('app-clinic-billable-services').should(
      'not.contain',
      'This Supervising Providers listing is inherited from'
    )
  })

  it('Should allow a provider to add a supervising provider', function () {
    standardSetup()

    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=billable-services`)

    cy.get('app-clinic-billable-services')

    cy.tick(1000)

    cy.get('button').contains('Add Coach').click()

    cy.get('mat-dialog-container')
      .find('input[data-placeholder="Search"]')
      .type('test value')

    cy.get('mat-dialog-container').click()

    cy.tick(1000)
    cy.get('mat-dialog-container')
      .find('input[data-placeholder="Search"]')
      .click()

    cy.wait(500)

    cy.tick(1000)
    cy.get('mat-option').eq(0).click()
    cy.tick(1000)

    cy.get('mat-dialog-container').find('button').contains('Add Coach').click()

    cy.tick(1000)

    cy.wait('@supervisingProviderPostRequest').should((xhr) => {
      expect(xhr.request.body.account).to.equal('1')
      expect(xhr.request.body.organization).to.equal('1')
    })
  })

  it('Should prevent a provider from adding a supervising provider if the list is inherited', function () {
    standardSetup({
      apiOverrides: [
        {
          url: '1.0/care-management/supervising-provider?**',
          fixture: '/api/rpm/supervisingProvidersInherited'
        }
      ]
    })

    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=billable-services`)

    cy.get('app-clinic-billable-services').should(
      'not.contain',
      'This Supervising Providers listing is inherited from'
    )

    cy.get('button').contains('Add Coach').should('not.exist')
  })

  it('Should allow a provider to remove a supervising provider', function () {
    standardSetup()

    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=billable-services`)

    cy.get('app-clinic-billable-services')

    cy.tick(1000)

    cy.get('tbody').should('contain', 'Test').should('contain', 'Coach')

    cy.get('tbody').find('tr').eq(0).find('mat-icon').contains('delete').click()

    cy.tick(1000)

    cy.get('mat-dialog-container').find('button').contains('Yes').click()

    cy.tick(1000)

    cy.wait('@supervisingProviderDeleteRequest').should((xhr) => {
      expect(xhr.request.url).to.contain('1')
    })
  })

  it('Should prevent a provider from deleting a supervising provider if the list is inherited', function () {
    standardSetup({
      apiOverrides: [
        {
          url: '1.0/care-management/supervising-provider?**',
          fixture: '/api/rpm/supervisingProvidersInherited'
        }
      ]
    })

    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=billable-services`)

    cy.get('app-clinic-billable-services')

    cy.tick(1000)

    cy.get('tbody').should('contain', 'Test').should('contain', 'Coach')

    cy.get('tbody')
      .find('tr')
      .eq(0)
      .find('mat-icon')
      .contains('delete')
      .should('have.class', 'disabled')
    cy.get('tbody').find('tr').eq(0).find('mat-icon').contains('delete').click()

    cy.tick(1000)

    cy.get('mat-dialog-container').should('not.exist')
  })

  it('Should allow a provider to change its own TIN', function () {
    standardSetup({
      apiOverrides: [
        {
          url: '/1.0/care-management/preference/organization?**',
          fixture: 'api/care-management/getPreferenceOrganizationWithoutTIN'
        }
      ]
    })

    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=billable-services`)

    cy.get('app-clinic-billable-services')

    cy.tick(1000)

    cy.get('input[data-placeholder="##-#######"]').clear().type('987654321')

    cy.tick(1000)

    cy.wait('@careManagementPreferencePatchRequest').should((xhr) => {
      expect(xhr.request.body.taxIdentificationNumber).to.equal('98-7654321')
    })
  })

  it('Should prevent a provider from changing an inherited TIN', function () {
    standardSetup({
      apiOverrides: [
        {
          url: '/1.0/rpm/preference/organization?organization=**',
          fixture: '/api/rpm/getOrgPreferenceInherited'
        }
      ]
    })

    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=billable-services`)

    cy.get('app-clinic-billable-services')

    cy.tick(1000)

    cy.get('input[data-placeholder="##-#######"]').should(
      'have.attr',
      'readonly'
    )

    cy.wait(2000)
  })

  it('Should allow a provider to move from an inherited TIN to an own TIN', function () {
    standardSetup({
      apiOverrides: [
        {
          url: '/1.0/rpm/preference/organization?organization=**',
          fixture: '/api/rpm/getOrgPreferenceInherited'
        }
      ]
    })

    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=billable-services`)

    cy.get('app-clinic-billable-services')

    cy.tick(1000)

    cy.get('ccr-tin-input')
      .find('mat-icon')
      .contains('edit')
      .should('not.exist')

    cy.tick(1000)

    cy.get('ccr-tin-input').find('mat-icon').contains('delete').click()

    cy.tick(1000)

    cy.get('mat-dialog-container').find('button').contains('Remove').click()

    cy.tick(1000)

    cy.wait('@careManagementPreferencePostRequest').should((xhr) => {
      expect(xhr.request.body.organization).to.equal('1')
      expect(xhr.request.body.isActive).to.equal(true)
    })
  })

  it('Should allow a provider to move from an own TIN to an inherited TIN', function () {
    standardSetup({
      apiOverrides: [
        {
          url: '/1.0/care-management/preference/organization?**',
          fixture: 'api/care-management/getPreferenceOrganizationWithoutTIN'
        }
      ]
    })

    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=billable-services`)

    cy.get('app-clinic-billable-services')

    cy.tick(1000)

    cy.get('app-clinic-billable-services').should(
      'not.contain',
      'This TIN is inherited from'
    )

    cy.get('ccr-tin-input').find('mat-icon').contains('delete').click()

    cy.tick(1000)

    cy.get('mat-dialog-container').find('button').contains('Remove').click()

    cy.tick(1000)

    cy.wait('@careManagementPreferenceDeleteRequest').should((xhr) => {
      expect(xhr.request.url).to.contain('1')
    })
  })
})
