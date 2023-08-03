import { standardSetup } from '../../../../../support'
import { selectCareManagementServiceType } from '../../../../../support/care-management'

describe('Reports -> Care Managment -> Clinic Patient Code Report -> CCM', function () {
  beforeEach(() => {
    cy.setTimezone('et')

    standardSetup({
      startDate: Date.UTC(2023, 7, 1),
      apiOverrides: [
        {
          url: '/1.0/warehouse/care-management/billing/snapshot**',
          fixture: 'api/warehouse/getCCMBillingSnapshot-2023-07-31.json'
        }
      ]
    })

    selectCareManagementServiceType('ccm')

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

    cy.get('@headerColumns').should('have.length', 9)

    const firstRowData = [
      'ID',
      'Name',
      'Episodes of Care',
      '99490 Monitoring Time unsatisfied',
      '99490 Monitoring Time satisfied',
      '99439 X1 unsatisfied',
      '99439 X1 satisfied',
      '99439 X2 unsatisfied',
      '99439 X2 satisfied'
    ]

    firstRowData.forEach((cell, index) => {
      cy.get('@headerColumns').eq(index).should('contain', cell)
    })
  })

  it('Cell values are correct', function () {
    cy.get('@reportTableBody').find('tr').as('tableBodyRows')

    const tableData = [
      ['23', '4', '19', '6', '17', '8', '15'],
      ['22', '4', '18', '6', '16', '8', '14'],
      ['1', '0', '1', '0', '1', '0']
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
        expect(data[0]['Unique Patients']).to.equal('23')
        expect(data[0]['CCM Unique Episodes of Care']).to.equal('23')
        expect(data[0]['99490 Monitoring Time unsatisfied']).to.equal('4')
        expect(data[0]['99490 Monitoring Time satisfied']).to.equal('19')
        expect(data[0]['99439 X1 unsatisfied']).to.equal('6')
        expect(data[0]['99439 X1 satisfied']).to.equal('17')
        expect(data[0]['99439 X2 unsatisfied']).to.equal('8')
        expect(data[0]['99439 X2 satisfied']).to.equal('15')
      })
    })
  })
})
