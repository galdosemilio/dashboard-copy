import { standardSetup } from '../../../support'

describe('Patients -> Add Patient -> Select packages', function () {
  beforeEach(() => {
    cy.setTimezone('et')
    standardSetup()
  })

  it('Allows a provider to create a patient account', function () {
    cy.setOrganization('ccr')
    cy.visit(`/accounts/patients`)
    cy.get('dieter-listing-with-phi')
      .find('a')
      .contains('Add New Patient')
      .click()

    cy.get('mat-dialog-container')
      .find('input[data-placeholder="First Name"]')
      .type('test first name')

    cy.get('mat-dialog-container')
      .find('input[data-placeholder="Last Name"]')
      .type('test last name')

    cy.get('mat-dialog-container')
      .find('input[data-placeholder="Email"]')
      .type('test@test.com')

    cy.get('mat-dialog-container')
      .find('input[data-placeholder="Phone"]')
      .type('1111111')

    cy.get('mat-dialog-container')
      .find('input[data-placeholder="Date of Birth"]')
      .eq(1)
      .type('1/1/2000')

    cy.get('mat-dialog-container')
      .find('div.mat-select-trigger')
      .eq(1)
      .click({ force: true })
    cy.tick(1000)

    cy.get('mat-option').contains('Male').click({ force: true })
    cy.tick(1000)

    cy.get('mat-dialog-container')
      .find('div.mat-select-trigger')
      .eq(2)
      .click({ force: true })
    cy.tick(1000)

    cy.get('mat-option').contains('6').click({ force: true })
    cy.tick(1000)

    cy.get('mat-dialog-container')
      .find('div.mat-select-trigger')
      .eq(3)
      .click({ force: true })
    cy.tick(1000)

    cy.get('mat-option').contains('0').click({ force: true })
    cy.tick(1000)

    cy.get('mat-dialog-container')
      .find('input[data-placeholder="Weight Goal (Optional)"]')
      .type('200')

    cy.get('button').contains('Add New Address').click()

    cy.tick(1000)

    cy.get('mat-dialog-container')
      .find('div.mat-select-trigger')
      .eq(6)
      .click({ force: true })

    cy.get('mat-option').contains('Billing').click({ force: true })
    cy.tick(1000)
    cy.get('.cdk-overlay-transparent-backdrop').click()

    cy.get('mat-dialog-container')
      .find('input[data-placeholder="Address Line 1"]')
      .type('Address Line 1')
    cy.get('mat-dialog-container')
      .find('input[data-placeholder="Address Line 2"]')
      .type('Address Line 2')
    cy.get('mat-dialog-container')
      .find('input[data-placeholder="City"]')
      .type('City')
    cy.get('mat-dialog-container')
      .find('input[data-placeholder="State"]')
      .type('State')
    cy.get('mat-dialog-container')
      .find('input[data-placeholder="Postal Code"]')
      .type('123456')

    cy.tick(1000)

    cy.get('app-content-package-table').find('mat-row').as('packageRows')

    cy.get('@packageRows')
      .eq(0)
      .should('contain', 'Package 1')
      .find('mat-checkbox')
      .click()

    cy.get('mat-dialog-container')
      .find('button')
      .contains('Save New User')
      .click({ force: true })

    cy.wait('@accountPostRequest').should((xhr) => {
      expect(xhr.request.body.accountType).to.equal('3')
      expect(xhr.request.body.association.organization).to.equal('1')
      expect(xhr.request.body.client.birthday).to.equal('2000-01-01')
      expect(xhr.request.body.client.gender).to.equal('male')
      expect(xhr.request.body.client.height).to.equal(183)
      expect(xhr.request.body.countryCode).to.equal('+1')
      expect(xhr.request.body.email).to.equal('test@test.com')
      expect(xhr.request.body.firstName).to.equal('test first name')
      expect(xhr.request.body.hasMinimumAgeConsent).to.equal(false)
      expect(xhr.request.body.isActive).to.equal(true)
      expect(xhr.request.body.lastName).to.equal('test last name')
      expect(xhr.request.body.measurementPreference).to.equal('us')
      expect(xhr.request.body.countryCode).to.equal('+1')
      expect(xhr.request.body.packages[0].id).to.equal('1')
      expect(xhr.request.body.packages[0].organization.id).to.equal('1')
      expect(xhr.request.body.packages[0].title).to.equal('Package 1')
      expect(xhr.request.body.phone).to.equal('1111111')
      expect(xhr.request.body.preferredLocales[0]).to.equal('en')
      expect(xhr.request.body.timezone).to.equal('America/New_York')
    })

    cy.wait('@goalPutRequest').should((xhr) => {
      expect(xhr.request.body.account).to.equal('1')
      expect(xhr.request.body.goal[0].goal).to.equal('weight')
      expect(xhr.request.body.goal[0].quantity).to.equal(90718)
    })

    cy.wait('@postAddressRequest').should((xhr) => {
      expect(xhr.request.url).to.contain('1')
      expect(xhr.request.body.address1).to.equal('Address Line 1')
      expect(xhr.request.body.address2).to.equal('Address Line 2')
      expect(xhr.request.body.city).to.equal('City')
      expect(xhr.request.body.stateProvince).to.equal('State')
      expect(xhr.request.body.postalCode).to.equal('123456')
      expect(xhr.request.body.labels[0]).to.equal('1')
    })

    cy.wait(2000)
  })

  it('Packages show in add patient modal', function () {
    cy.visit(`/accounts/patients`)
    cy.get('dieter-listing-with-phi')
      .find('a')
      .contains('Add New Patient')
      .click()

    cy.get('[data-cy=clientStartedAtInput]').should('have.length', 1)

    cy.get('app-content-package-table').find('mat-row').as('packageRows')

    cy.get('@packageRows').should('have.length', 3)

    cy.get('@packageRows')
      .eq(0)
      .should('contain', 'Package 1')
      .find('mat-checkbox')
      .click()
    cy.get('@packageRows').eq(1).should('contain', 'Package 2')
    cy.get('@packageRows')
      .eq(2)
      .should('contain', 'Package 3')
      .find('mat-checkbox')
      .click()
  })

  it('Shows the underage client warning', function () {
    cy.visit(`/accounts/patients`)
    cy.get('dieter-listing-with-phi')
      .find('a')
      .contains('Add New Patient')
      .click()

    cy.get('[data-cy=clientStartedAtInput]').should('have.length', 1)

    cy.wait(1000)

    cy.get('[data-placeholder="Date of Birth"]').eq(1).click({ force: true })

    cy.tick(1000)

    cy.get('[data-placeholder="Date of Birth MM/DD/YYYY"]')
      .eq(0)
      .type('06/21/2019')
      .trigger('blur', { force: true })

    cy.tick(1000)

    cy.get('span').contains('I understand that this account')
  })

  it('Shows error messages if attempting to submit an empty form', function () {
    cy.visit(`/accounts/patients`)
    cy.get('dieter-listing-with-phi')
      .find('a')
      .contains('Add New Patient')
      .click()

    cy.get('mat-dialog-container')
      .find('button')
      .contains('Save New User')
      .click({ force: true })
    cy.tick(1000)

    cy.get('mat-dialog-container').should(
      'contain',
      'Date of birth is required'
    )
  })

  it('Shows the Codice Fiscale account identifier if clinic is in Italy', function () {
    cy.setOrganization('apollo-italy')

    standardSetup({
      apiOverrides: [
        {
          url: '/2.0/access/organization?**',
          fixture: 'api/organization/getAll'
        }
      ]
    })

    cy.visit(`/accounts/patients`)
    cy.get('dieter-listing-with-phi')
      .find('a')
      .contains('Add New Patient')
      .click()

    cy.tick(1000)

    cy.get('mat-dialog-container')
      .find('app-account-identifiers')
      .find('.mat-select-trigger')
      .click({ force: true })

    cy.tick(1000)

    cy.get('mat-option').contains('Codice Fiscale').should('exist')
  })

  it('Does not show the Codice Fiscale account identifier if clinic is not in Italy', function () {
    cy.setOrganization('apollo-us')

    standardSetup({
      apiOverrides: [
        {
          url: '/2.0/access/organization?**',
          fixture: 'api/organization/getAll'
        }
      ]
    })

    cy.visit(`/accounts/patients`)
    cy.get('dieter-listing-with-phi')
      .find('a')
      .contains('Add New Patient')
      .click()

    cy.tick(1000)

    cy.get('mat-dialog-container')
      .find('app-account-identifiers')
      .should('be.hidden')
  })
})
