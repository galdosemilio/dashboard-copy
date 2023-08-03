import { standardSetup } from '../../../../../support'
import { selectCareManagementServiceType } from '../../../../../support/care-management'

describe('Reports -> Care Managment -> Clinic Patient Code Report -> BHI', function () {
  beforeEach(() => {
    cy.setTimezone('et')

    standardSetup({
      startDate: Date.UTC(2023, 7, 1),
      apiOverrides: [
        {
          url: '/1.0/warehouse/care-management/billing/snapshot**',
          fixture: 'api/warehouse/getBHIBillingSnapshot-2023-07-31.json'
        }
      ]
    })

    selectCareManagementServiceType('bhi')

    cy.visit('/reports/rpm/clinic-patient-code')

    cy.get('[data-cy="clinic-patient-code-report-table-header"]').as(
      'reportTableHeader'
    )
    cy.get('[data-cy="clinic-patient-code-report-table-body"]').as(
      'reportTableBody'
    )
    cy.tick(1000)
  })

  it('Table headers are correct', function () {
    cy.get('@reportTableHeader').get('th').as('headerColumns')

    cy.get('@headerColumns').should('have.length', 5)

    const firstRowData = [
      'ID',
      'Name',
      'Episodes of Care',
      '99484 Monitoring Time unsatisfied',
      '99484 Monitoring Time satisfied'
    ]

    firstRowData.forEach((cell, index) => {
      cy.get('@headerColumns').eq(index).should('contain', cell)
    })
  })

  it('Cell values are correct', function () {
    cy.get('@reportTableBody').find('tr').as('tableBodyRows')

    const tableData = [
      ['76', '22', '54'],
      ['70', '21', '49'],
      ['5', '0', '5'],
      ['1', '1', '0']
    ]

    tableData.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        cy.get('@tableBodyRows')
          .eq(rowIndex)
          .find('td')
          .eq(cellIndex + 2)
          .should('contain', cell)
      })
    })
  })

  it('CSV download is correct', function () {
    cy.get('[data-cy="download-csv-button"]')
      .should('be.visible')
      .should('contain', 'Export CSV')
      .click()

    cy.wait(1500)

    cy.readFile(
      Cypress.config().downloadsFolder +
        '/clinic_patient_code_report_2023_07_31_csv.csv'
    ).then((data) => {
      cy.task('parseCsv', data).then((data) => {
        expect(data[0]['Unique Patients']).to.equal('76')
        expect(data[0]['BHI Unique Episodes of Care']).to.equal('76')
        expect(data[0]['99484 Monitoring Time unsatisfied']).to.equal('22')
        expect(data[0]['99484 Monitoring Time satisfied']).to.equal('54')
      })
    })
  })
})
