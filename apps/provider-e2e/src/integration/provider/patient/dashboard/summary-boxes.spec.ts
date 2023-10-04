import { standardSetup } from './../../../../support'

describe('Patient profile -> dashboard -> summary boxes', function () {
  beforeEach(() => {
    cy.setTimezone('aet')
    standardSetup()
  })

  it('Summary boxes show data properly', function () {
    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    cy.get('.ccr-dashboard', {
      timeout: 12000
    })
      .find('ccr-stat-diff')
      .as('summaryBoxes')
    cy.get('@summaryBoxes').should('have.length', 5)
    summaryBoxesContains(
      cy.get('@summaryBoxes'),
      0,
      'Starting: 181.0'
    ).contains('Current: 185.0')
    summaryBoxesContains(cy.get('@summaryBoxes'), 1, 'Starting: 29.9').contains(
      'Current: 37.0'
    )
    summaryBoxesContains(
      cy.get('@summaryBoxes'),
      2,
      'Starting: 151.1'
    ).contains('Current: 148.0')
    summaryBoxesContains(
      cy.get('@summaryBoxes'),
      3,
      'Starting: 110.2'
    ).contains('Current: 114.7')
    summaryBoxesContains(cy.get('@summaryBoxes'), 4, 'Starting: 23.0').contains(
      'Current: 19.0'
    )
  })

  describe('Summary boxes correct device type', function () {
    it('Summary boxes show weight data for RPM episode of care', function () {
      interceptBillingSnapshot('1', 1)
      cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

      cy.wait('@careManagementBillingSnapshotRPM')

      cy.get('[data-cy="summary-box-device-type"]')
        .should('exist')
        .and('have.attr', 'data-value', 'weight')

      cy.get('ccr-stat-diff').as('summaryBoxes')
      cy.get('@summaryBoxes').should('have.length', 5)
      summaryBoxesContains(cy.get('@summaryBoxes'), 0, 'Weight Change')
    })

    it('Summary boxes show blood pressure data for RTM episode of care', function () {
      cy.intercept('GET', '1.0/measurement/data-point/summary?**', {
        fixture: 'api/measurement/dataPointBloodPressureSummary'
      }).as('bloodPressureSummary')
      interceptBillingSnapshot('1')
      interceptBillingSnapshot('3', 2)

      cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

      cy.wait('@careManagementBillingSnapshotRPM')
      cy.wait('@careManagementBillingSnapshotRTM')
      cy.wait('@bloodPressureSummary')

      cy.get('[data-cy="summary-box-device-type"]')
        .should('exist')
        .and('have.attr', 'data-value', 'bloodPressure')

      cy.get('ccr-stat-count').as('summaryBoxes')
      cy.get('@summaryBoxes').should('have.length', 3)
      summaryBoxesContains(cy.get('@summaryBoxes'), 0, 'Diastolic').contains(
        '80 mmHg'
      )
      summaryBoxesContains(cy.get('@summaryBoxes'), 1, 'Systolic').contains(
        '120 mmHg'
      )
      summaryBoxesContains(cy.get('@summaryBoxes'), 2, 'Heart Rate').contains(
        '100 bpm'
      )
    })

    it('Summary boxes show glucometer data for RTM episode of care', function () {
      interceptBillingSnapshot('1', 3)
      cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

      cy.wait('@careManagementBillingSnapshotRPM')

      cy.get('[data-cy="summary-box-device-type"]')
        .should('exist')
        .and('have.attr', 'data-value', 'glucometer')

      cy.get('ccr-stat-count').as('summaryBoxes')
      cy.get('@summaryBoxes').should('have.length', 1)
      summaryBoxesContains(cy.get('@summaryBoxes'), 0, 'Glucose').contains(
        'No Recent Data'
      )
    })

    it('Summary boxes show pulseOximeter data for RTM episode of care', function () {
      interceptBillingSnapshot('1', 4)
      cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

      cy.wait('@careManagementBillingSnapshotRPM')

      cy.get('[data-cy="summary-box-device-type"]')
        .should('exist')
        .and('have.attr', 'data-value', 'pulseOximeter')

      cy.get('ccr-stat-count').as('summaryBoxes')
      cy.get('@summaryBoxes').should('have.length', 3)
      summaryBoxesContains(cy.get('@summaryBoxes'), 0, 'SpO2').contains(
        'No Recent Data'
      )
      summaryBoxesContains(
        cy.get('@summaryBoxes'),
        1,
        'Current Perfusion'
      ).contains('No Recent Data')
      summaryBoxesContains(cy.get('@summaryBoxes'), 2, 'Heart Rate').contains(
        'No Recent Data'
      )
    })

    it('Summary boxes should default to weight data if no episode of care', function () {
      interceptBillingSnapshot('1')
      interceptBillingSnapshot('3')

      cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

      cy.wait('@careManagementBillingSnapshotRPM')
      cy.wait('@careManagementBillingSnapshotRTM')

      cy.get('[data-cy="summary-box-device-type"]')
        .should('exist')
        .and('have.attr', 'data-value', 'weight')
    })
  })
})

function summaryBoxesContains(
  summaryBoxes: Cypress.Chainable<JQuery<HTMLElement>>,
  index: number,
  text: string
) {
  return summaryBoxes
    .eq(index)
    .should('contain', text)
    .then(() => summaryBoxes)
}

function interceptBillingSnapshot(
  serviceType: string,
  planId: number | undefined = undefined
) {
  cy.intercept(
    {
      url: '/1.0/warehouse/care-management/billing/snapshot**',
      query: {
        status: 'all',
        serviceType: serviceType
      }
    },
    {
      body: {
        data: planId
          ? [
              {
                state: {
                  plan: {
                    id: planId
                  }
                }
              }
            ]
          : []
      }
    }
  ).as(
    serviceType === '3'
      ? 'careManagementBillingSnapshotRTM'
      : 'careManagementBillingSnapshotRPM'
  )
}
