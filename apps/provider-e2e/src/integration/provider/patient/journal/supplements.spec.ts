import { standardSetup } from '../../../../support'
import { assertTableRow } from '../../../helpers'

describe('Dashboard -> Patients -> Patient -> Journal -> Supplements', function () {
  it('Shows Supplement data in Eastern Time (New York)', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(
      `/accounts/patients/${Cypress.env('clientId')}/journal;s=supplements`
    )

    cy.get('app-dieter-journal-supplements-table', { timeout: 12000 })
      .find('tbody tr')
      .as('supplementRows')

    cy.get('@supplementRows').should('have.length', 7)

    assertTableRow(cy.get('@supplementRows').eq(3), ['Sat, Dec 28', '0/1'])

    assertTableRow(cy.get('@supplementRows').eq(4), [
      'Sun, Dec 29',
      '1/2',
      '1/1'
    ])

    assertTableRow(cy.get('@supplementRows').eq(5), [
      'Mon, Dec 30',
      '1/2',
      '1/1'
    ])

    assertTableRow(cy.get('@supplementRows').eq(6), [
      'Tue, Dec 31',
      '1/2',
      '1/1',
      '2/2',
      '0/1'
    ])
  })

  it('Shows Supplement data in Eastern Time (Australia)', function () {
    cy.setTimezone('aet')
    standardSetup()

    cy.visit(
      `/accounts/patients/${Cypress.env('clientId')}/journal;s=supplements`
    )

    cy.get('app-dieter-journal-supplements-table', { timeout: 12000 })
      .find('tbody tr')
      .as('supplementRows')

    cy.get('@supplementRows').should('have.length', 7)

    assertTableRow(cy.get('@supplementRows').eq(3), ['Sat, Dec 28', '0/1'])

    assertTableRow(cy.get('@supplementRows').eq(4), [
      'Sun, Dec 29',
      '1/2',
      '1/1'
    ])

    assertTableRow(cy.get('@supplementRows').eq(5), [
      'Mon, Dec 30',
      '1/2',
      '1/1'
    ])

    assertTableRow(cy.get('@supplementRows').eq(6), [
      'Tue, Dec 31',
      '1/2',
      '1/1',
      '2/2',
      '0/1'
    ])
  })
})
