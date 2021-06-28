import { standardSetup } from '../../../support'

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

    cy.tick(1000)

    cy.wait('@goalPutRequest').should((xhr) => {
      expect(xhr.request.body.goal[0].goal).to.equal('calorie')
      expect(xhr.request.body.goal[0].quantity).to.equal(2500)

      expect(xhr.request.body.goal[1].goal).to.equal('dailySleep')
      expect(xhr.request.body.goal[1].quantity).to.equal(420)

      expect(xhr.request.body.goal[2].goal).to.equal('dailyStep')
      expect(xhr.request.body.goal[2].quantity).to.equal(19000)

      expect(xhr.request.body.goal[3].goal).to.equal('dailyHydration')
      expect(xhr.request.body.goal[3].quantity).to.equal(3549)

      expect(xhr.request.body.goal[4].goal).to.equal('weeklyExercise')
      expect(xhr.request.body.goal[4].quantity).to.equal(180)

      expect(xhr.request.body.goal[5].goal).to.equal('weight')
      expect(xhr.request.body.goal[5].quantity).to.equal(90718)
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
