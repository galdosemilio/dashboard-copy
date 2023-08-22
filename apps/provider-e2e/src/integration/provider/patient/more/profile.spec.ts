import { standardSetup } from './../../../../support'

const startDateTests = [
  {
    timezone: 'UTC',
    apiOverride: 'getSinglePatient'
  },
  {
    timezone: 'HST',
    apiOverride: 'getSinglePatientHST'
  },
  {
    timezone: 'AET',
    apiOverride: 'getSinglePatientAET'
  }
]

const editStartDateTestTimezones = ['et', 'aet', 'hst']

describe('Patient profile -> more -> profile', function () {
  describe('Start Date is not affected by timezone', () => {
    for (const test of startDateTests) {
      it(`with ${test.timezone} timestamp`, () => {
        standardSetup({
          apiOverrides: [
            {
              url: `/2.0/account/${Cypress.env('clientId')}`,
              fixture: `api/account/${test.apiOverride}`
            }
          ]
        })

        cy.visit(
          `/accounts/patients/${Cypress.env('clientId')}/settings;s=profile`
        )

        cy.get('[data-placeholder="Start Date"]')
          .eq(0)
          .should('have.value', '06/21/2019')
        cy.get('[data-placeholder="Start Date"]')
          .eq(1)
          .should('have.value', 'Jun 21, 2019')
        cy.wait(3000)
      })
    }
  })

  describe.only('Start Date edit is not affected by timezone', () => {
    for (const timezone of editStartDateTestTimezones) {
      it(`with ${timezone} timezone`, () => {
        cy.setTimezone(timezone)
        standardSetup()
        cy.visit(
          `/accounts/patients/${Cypress.env('clientId')}/settings;s=profile`
        )

        cy.wait(10000)

        cy.get('[data-placeholder="Start Date"]').eq(1).click({ force: true })

        cy.tick(1000)

        cy.get('[data-placeholder="Start Date MM/DD/YYYY"]')
          .eq(0)
          .type('01/01/2000')
          .trigger('blur', { force: true })

        cy.tick(1000)

        cy.get('.ccr-button')
          .get('[data-cy="update-user-button"]')
          .eq(0)
          .click()

        cy.wait('@accountPatchRequest')
        cy.wait('@accountPatchRequest').should((xhr) => {
          console.log(xhr.request.body)
          expect(xhr.request.body.client.startedAt).to.equal('2000-01-01')
        })
      })
    }
  })

  it('Shows the underage client warning', function () {
    cy.setTimezone('aet')
    standardSetup()
    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings;s=profile`)

    cy.wait(10000)

    cy.get('[data-placeholder="Date of Birth"]').eq(1).click({ force: true })

    cy.tick(1000)

    cy.get('[data-placeholder="Date of Birth MM/DD/YYYY"]')
      .eq(0)
      .type('06/21/2019')
      .trigger('blur', { force: true })

    cy.tick(1000)

    cy.get('span').contains('I understand that this account')
  })
})
