import { standardSetup } from '../../../support'

describe('Clinics -> Clinic -> Measurements', function () {
  it('Properly displays the Clinic Measurement Information', function () {
    standardSetup()

    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=measurements`)

    // Preference Assertion
    cy.get('mat-slide-toggle')

    cy.tick(1000)

    cy.get('mat-slide-toggle')
      .find('input[type="checkbox"]')
      .should('be.enabled')

    cy.get('mat-slide-toggle')
      .find('input[type="checkbox"]')
      .should('not.be.checked')

    // Measurement Label Assertion
    cy.get('app-clinic-measurement-labels')
      .find('table')
      .find('tr.level0')
      .as('labelRows')
    cy.get('app-clinic-measurement-labels')
      .find('table')
      .find('tr.level1')
      .as('dataTypeRows')

    cy.get('@labelRows').should('have.length', 3)
    cy.get('@dataTypeRows').should('have.length', 12)

    // "Measurement" Assertion
    cy.get('@labelRows')
      .eq(0)
      .should('contain', '1')
      .should('contain', 'Composition')

    cy.get('@dataTypeRows')
      .eq(0)
      .should('contain', '4')
      .should('contain', 'BMI')
      .should('contain', '0')
      .should('contain', '200')

    cy.get('@dataTypeRows')
      .eq(1)
      .should('contain', '2')
      .should('contain', 'Body fat')
      .should('contain', '%')
      .should('contain', '1')
      .should('contain', '100')

    cy.get('@dataTypeRows')
      .eq(2)
      .should('contain', '1')
      .should('contain', 'Weight')
      .should('contain', 'g')
      .should('contain', '1')
      .should('contain', '1653')

    cy.get('@dataTypeRows')
      .eq(3)
      .should('contain', '3')
      .should('contain', 'Fat mass weight')
      .should('contain', 'g')
      .should('contain', '1')
      .should('contain', '1653')

    // Label with Translations Assertion
    cy.get('@labelRows')
      .eq(1)
      .should('contain', '19')
      .should('contain', 'Label with Translations')

    // "Special Types" Assertion
    cy.get('@labelRows')
      .eq(2)
      .should('contain', '21')
      .should('contain', 'Special Types')

    cy.get('@dataTypeRows')
      .eq(9)
      .should('contain', '23')
      .should('contain', 'Steps')
      .should('contain', '1')
      .should('contain', '100000')

    cy.get('@dataTypeRows')
      .eq(10)
      .should('contain', '24')
      .should('contain', 'Sleep')
      .should('contain', 'minutes')
      .should('contain', '1')
      .should('contain', '1440')

    cy.get('@dataTypeRows')
      .eq(11)
      .should('contain', '25')
      .should('contain', 'Hydration')
      .should('contain', 'oz')
      .should('contain', '1')
      .should('contain', '1353')
  })

  it('Properly displays the Clinic Measurement Information on Inheritance', function () {
    standardSetup({
      apiOverrides: [
        {
          url: '/1.0/measurement/preference?**',
          fixture: 'api/measurement/preferenceInherited'
        }
      ]
    })

    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=measurements`)

    cy.get('mat-slide-toggle')

    cy.tick(1000)

    cy.get('mat-slide-toggle').should('have.length', 1)

    cy.get('mat-slide-toggle')
      .find('input[type="checkbox"]')
      .not('hidden')
      .should('be.enabled')
      .should('be.checked')

    cy.get('ccr-feature-toggle-input')
      .should('contain', 'The preference is being inherited')
      .should('contain', 'CoachCare')
      .should('contain', 'ID 1') // this is because our mocked route ALWAYS returns 'ID 1'
  })

  it('Properly displays the Clinic Measurement Information on Inheritance (blocked)', function () {
    standardSetup({
      apiOverrides: [
        {
          url: '/1.0/measurement/preference?**',
          fixture: 'api/measurement/preferenceInheritedNonEditable'
        }
      ]
    })

    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=measurements`)

    cy.get('mat-slide-toggle')

    cy.tick(1000)

    cy.get('mat-slide-toggle').should('have.length', 1)

    cy.get('mat-slide-toggle')
      .find('input[type="checkbox"]')
      .should('be.enabled')

    cy.get('mat-slide-toggle')
      .find('input[type="checkbox"]')
      .should('be.checked')

    cy.get('ccr-feature-toggle-input')
      .should('contain', 'The preference is being inherited')
      .should('contain', 'CoachCare')
      .should('contain', 'ID 1') // this is because our mocked route ALWAYS returns 'ID 1'

    // Table buttons assertion
    cy.get('button').contains('Add Category').parent().should('be.disabled')

    cy.get('button').contains('Add Data Point').parent().should('be.disabled')

    cy.get('button').contains('Reorder').parent().should('be.disabled')

    // Table actions assertion
    cy.get('app-clinic-measurement-labels')
      .find('mat-icon')
      .contains('edit')
      .should('have.class', 'disabled')

    cy.get('app-clinic-measurement-labels')
      .find('mat-icon')
      .contains('delete')
      .should('have.class', 'disabled')
  })

  it('Allows the provider to add a Category', function () {
    standardSetup()

    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=measurements`)

    // Measurement Label Assertion
    cy.get('app-clinic-measurement-labels').find('table').find('tr.level0')

    cy.get('button').contains('Add Category').click()

    cy.wait(1000)

    cy.get('mat-dialog-container')
      .find('input[data-placeholder="Name"]')
      .type('Test Label')
    cy.get('mat-dialog-container')
      .find('input[data-placeholder="Description"]')
      .type('Test Description')

    cy.get('button').contains('Save').click()

    cy.tick(1000)

    cy.wait('@measurementLabelPostRequest').should((xhr) => {
      expect(xhr.request.body.name).to.equal('Test Label')
      expect(xhr.request.body.description).to.equal('Test Description')
      expect(xhr.request.body.organization).to.equal('1')
    })

    cy.wait('@measurementLabelGetRequest')
  })

  it('Allows the provider to edit a Category', function () {
    standardSetup()

    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=measurements`)

    // Measurement Label Assertion
    cy.get('app-clinic-measurement-labels')
      .find('table')
      .find('tr.level0')
      .as('labelRows')

    cy.get('@labelRows').eq(0).find('mat-icon').contains('edit').click()

    cy.tick(1000)

    cy.get('mat-dialog-container')
      .find('input[data-placeholder="Name"]')
      .clear()
      .type('Edited Label')
    cy.get('mat-dialog-container')
      .find('input[data-placeholder="Description"]')
      .clear()
      .type('Edited Description')

    cy.get('button').contains('Save').click()

    cy.tick(1000)

    cy.wait('@measurementLabelPatchRequest').should((xhr) => {
      expect(xhr.request.body.id).to.equal('1')
      expect(xhr.request.body.name).to.contains('Edited Label')
      expect(xhr.request.body.description).to.contains('Edited Description')
    })

    cy.wait('@measurementLabelGetRequest')
  })

  it('Allows the provider to remove a Category', function () {
    standardSetup()

    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=measurements`)

    // Measurement Label Assertion
    cy.get('app-clinic-measurement-labels')
      .find('table')
      .find('tr.level0')
      .as('labelRows')

    cy.get('@labelRows').eq(0).find('mat-icon').contains('delete').click()

    cy.tick(1000)

    cy.get('button').contains('Yes').click()

    cy.tick(1000)

    cy.wait('@measurementLabelPatchRequest').should((xhr) => {
      expect(xhr.request.body.id).to.contain('1')
      expect(xhr.request.body.status).to.contain('inactive')
    })

    cy.wait('@measurementLabelGetRequest')
  })

  it('Allows the provider to add a Data Type association', function () {
    standardSetup()

    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=measurements`)

    cy.get('app-clinic-measurement-labels').find('table').find('tr.level0')

    cy.get('button').contains('Add Data Point').click()

    cy.tick(1000)

    cy.get('button').contains('Save').click()

    cy.tick(1000)

    cy.wait('@measurementDataPointTypeAssocPostRequest').should((xhr) => {
      expect(xhr.request.body.organization).to.equal('1')
      expect(xhr.request.body.type).to.equal('30')
      expect(xhr.request.body.label).to.equal('1')
    })

    cy.wait('@measurementLabelGetRequest').wait(300)
  })

  it('Allows the provider to remove a Data Type association', function () {
    standardSetup()

    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')};s=measurements`)

    // Measurement Label Assertion
    cy.get('app-clinic-measurement-labels')
      .find('table')
      .find('tr.level1')
      .as('dataTypeRows')

    cy.get('@dataTypeRows')
      .eq(0)
      .find('mat-icon')
      .contains('delete')
      .click({ force: true })

    cy.tick(1000)

    cy.get('button').contains('Yes').click()

    cy.tick(1000)

    cy.wait('@measurementDataPointTypeAssocDeleteRequest').should((xhr) => {
      expect(xhr.request.url).to.contain('4')
    })

    cy.wait('@measurementLabelGetRequest')
  })
})
