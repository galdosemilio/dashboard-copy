import { standardSetup } from '../../../../support'

describe('Dashboard -> Patients -> Patient -> More -> Goals', function () {
  it(`Properly shows the patient's goals`, function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings;s=goals`)
    cy.tick(1000)

    cy.get('input[data-placeholder="Weight Goal"]').should('have.value', 185)
    cy.get('input[data-placeholder="Daily Water Goal"]').should(
      'have.value',
      96
    )
    cy.get('input[data-placeholder="Daily Calories Goal"]').should(
      'have.value',
      2254
    )
    cy.get('input[data-placeholder="Daily Step Goal"]').should(
      'have.value',
      17500
    )
    cy.get('input[data-placeholder="Daily Sleep Goal"]').should('have.value', 8)
    cy.get('input[data-placeholder="Weekly Exercise Goal"]').should(
      'have.value',
      8
    )
  })

  it(`Properly updates the patient's goals`, function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings;s=goals`)
    cy.tick(1000)

    cy.get('input[data-placeholder="Weight Goal"]').clear().type('200')
    cy.get('input[data-placeholder="Daily Water Goal"]').clear().type('120')
    cy.get('input[data-placeholder="Daily Calories Goal"]').clear().type('2500')
    cy.get('input[data-placeholder="Daily Step Goal"]').clear().type('19000')
    cy.get('input[data-placeholder="Daily Sleep Goal"]').clear().type('7')
    cy.get('input[data-placeholder="Weekly Exercise Goal"]').clear().type('3')

    cy.get('button').contains('Save').click()

    cy.get('@goalPatchRequest.all').should('have.length', 4)
    const goalPatchRequest = [
      {
        id: '44',
        quantity: 2500
      },
      {
        id: '45',
        quantity: 19000
      },
      {
        id: '43',
        quantity: 3549
      },
      {
        id: '42',
        quantity: 90718
      }
    ]
    goalPatchRequest.forEach((item, i) => {
      cy.get(`@goalPatchRequest.${i + 1}`)
        .its('request.body')
        .should('deep.eq', {
          id: item.id,
          quantity: item.quantity
        })
    })
  })

  it(`Shows an error message for the fields if they are above their maximum value`, function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings;s=goals`)
    cy.tick(1000)

    cy.get('input[data-placeholder="Weight Goal"]').clear().type('1000')
    cy.get('input[data-placeholder="Daily Water Goal"]').clear().type('500')
    cy.get('input[data-placeholder="Daily Calories Goal"]').clear().type('6000')
    cy.get('input[data-placeholder="Daily Step Goal"]').clear().type('30000')
    cy.get('input[data-placeholder="Daily Sleep Goal"]').clear().type('20')
    cy.get('input[data-placeholder="Weekly Exercise Goal"]').clear().type('50')

    cy.get('input[data-placeholder="Weight Goal"]').should(
      'have.class',
      'ng-invalid'
    )
    cy.get('input[data-placeholder="Daily Water Goal"]').should(
      'have.class',
      'ng-invalid'
    )
    cy.get('input[data-placeholder="Daily Calories Goal"]').should(
      'have.class',
      'ng-invalid'
    )
    cy.get('input[data-placeholder="Daily Step Goal"]').should(
      'have.class',
      'ng-invalid'
    )
    cy.get('input[data-placeholder="Daily Sleep Goal"]').should(
      'have.class',
      'ng-invalid'
    )
    cy.get('input[data-placeholder="Weekly Exercise Goal"]').should(
      'have.class',
      'ng-invalid'
    )
  })

  it(`Shows an error message for the fields if they are below their minimum value`, function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings;s=goals`)
    cy.tick(1000)

    cy.get('input[data-placeholder="Weight Goal"]').clear().type('-1')
    cy.get('input[data-placeholder="Daily Water Goal"]').clear().type('-1')
    cy.get('input[data-placeholder="Daily Calories Goal"]').clear().type('-1')
    cy.get('input[data-placeholder="Daily Step Goal"]').clear().type('-1')
    cy.get('input[data-placeholder="Daily Sleep Goal"]').clear().type('-1')
    cy.get('input[data-placeholder="Weekly Exercise Goal"]').clear().type('-1')

    cy.get('input[data-placeholder="Weight Goal"]').should(
      'have.class',
      'ng-invalid'
    )
    cy.get('input[data-placeholder="Daily Water Goal"]').should(
      'have.class',
      'ng-invalid'
    )
    cy.get('input[data-placeholder="Daily Calories Goal"]').should(
      'have.class',
      'ng-invalid'
    )
    cy.get('input[data-placeholder="Daily Step Goal"]').should(
      'have.class',
      'ng-invalid'
    )
    cy.get('input[data-placeholder="Daily Sleep Goal"]').should(
      'have.class',
      'ng-invalid'
    )
    cy.get('input[data-placeholder="Weekly Exercise Goal"]').should(
      'have.class',
      'ng-invalid'
    )
  })
})
