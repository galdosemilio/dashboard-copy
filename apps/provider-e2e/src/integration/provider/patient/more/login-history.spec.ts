import { standardSetup } from '../../../../support'
import { assertTableRow } from '../../../helpers'

describe('Patient profile -> more -> login history', function () {
  it('Shows the login history elements in AET', function () {
    cy.setTimezone('aet')
    standardSetup()
    cy.visit(
      `/accounts/patients/${Cypress.env('clientId')}/settings;s=login-history`
    )

    cy.get('mat-table')
    cy.get('mat-row').as('loginHistoryRows')

    cy.get('@loginHistoryRows').should('have.length', 10)

    assertTableRow(cy.get('@loginHistoryRows').eq(0), [
      'Saturday Aug 15, 2020',
      '2:37am',
      'LeanMD (ID 3381)'
    ])

    assertTableRow(cy.get('@loginHistoryRows').eq(1), [
      'Saturday Aug 15, 2020',
      '2:34am',
      'LeanMD (ID 3381)'
    ])

    assertTableRow(cy.get('@loginHistoryRows').eq(2), [
      'Saturday Aug 15, 2020',
      '2:32am',
      'LeanMD (ID 3381)'
    ])

    assertTableRow(cy.get('@loginHistoryRows').eq(3), [
      'Saturday Aug 15, 2020',
      '2:30am',
      'LeanMD (ID 3381)'
    ])

    assertTableRow(cy.get('@loginHistoryRows').eq(4), [
      'Saturday Aug 15, 2020',
      '12:45am',
      'Scheduling Test 1 (ID 7444)'
    ])

    assertTableRow(cy.get('@loginHistoryRows').eq(5), [
      'Friday Aug 14, 2020',
      '10:59pm',
      'Scheduling Test 1 (ID 7444)'
    ])

    assertTableRow(cy.get('@loginHistoryRows').eq(6), [
      'Friday Aug 14, 2020',
      '5:46am',
      'LeanMD (ID 3381)'
    ])

    assertTableRow(cy.get('@loginHistoryRows').eq(7), [
      'Friday Aug 14, 2020',
      '5:44am',
      'LeanMD (ID 3381)'
    ])

    assertTableRow(cy.get('@loginHistoryRows').eq(8), [
      'Friday Aug 14, 2020',
      '5:35am',
      'LeanMD (ID 3381)'
    ])

    assertTableRow(cy.get('@loginHistoryRows').eq(9), [
      'Friday Aug 14, 2020',
      '5:11am',
      'LeanMD (ID 3381)'
    ])
  })

  it('Shows the login history elements in ET', function () {
    cy.setTimezone('et')
    standardSetup()
    cy.visit(
      `/accounts/patients/${Cypress.env('clientId')}/settings;s=login-history`
    )

    cy.get('mat-table', { timeout: 20000 })
    cy.get('mat-row').as('loginHistoryRows')

    cy.get('@loginHistoryRows').should('have.length', 10)

    assertTableRow(cy.get('@loginHistoryRows').eq(0), [
      'Friday Aug 14, 2020',
      '12:37pm',
      'LeanMD (ID 3381)'
    ])

    assertTableRow(cy.get('@loginHistoryRows').eq(1), [
      'Friday Aug 14, 2020',
      '12:34pm',
      'LeanMD (ID 3381)'
    ])

    assertTableRow(cy.get('@loginHistoryRows').eq(2), [
      'Friday Aug 14, 2020',
      '12:32pm',
      'LeanMD (ID 3381)'
    ])

    assertTableRow(cy.get('@loginHistoryRows').eq(3), [
      'Friday Aug 14, 2020',
      '12:30pm',
      'LeanMD (ID 3381)'
    ])

    assertTableRow(cy.get('@loginHistoryRows').eq(4), [
      'Friday Aug 14, 2020',
      '10:45am',
      'Scheduling Test 1 (ID 7444)'
    ])

    assertTableRow(cy.get('@loginHistoryRows').eq(5), [
      'Friday Aug 14, 2020',
      '8:59am',
      'Scheduling Test 1 (ID 7444)'
    ])

    assertTableRow(cy.get('@loginHistoryRows').eq(6), [
      'Thursday Aug 13, 2020',
      '3:46pm',
      'LeanMD (ID 3381)'
    ])

    assertTableRow(cy.get('@loginHistoryRows').eq(7), [
      'Thursday Aug 13, 2020',
      '3:44pm',
      'LeanMD (ID 3381)'
    ])

    assertTableRow(cy.get('@loginHistoryRows').eq(8), [
      'Thursday Aug 13, 2020',
      '3:35pm',
      'LeanMD (ID 3381)'
    ])

    assertTableRow(cy.get('@loginHistoryRows').eq(9), [
      'Thursday Aug 13, 2020',
      '3:11pm',
      'LeanMD (ID 3381)'
    ])
  })
})
