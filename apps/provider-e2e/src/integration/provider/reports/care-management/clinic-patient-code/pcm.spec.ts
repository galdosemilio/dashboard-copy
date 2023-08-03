import { standardSetup } from '../../../../../support'
import { selectCareManagementServiceType } from '../../../../../support/care-management'

describe('Reports -> Care Managment -> Clinic Patient Code Report -> PCM', function () {
  beforeEach(() => {
    cy.setTimezone('et')

    standardSetup({
      startDate: Date.UTC(2023, 7, 1),
      apiOverrides: [
        {
          url: '/1.0/warehouse/care-management/billing/snapshot**',
          fixture: 'api/warehouse/getPCMBillingSnapshot-2023-07-31.json'
        }
      ]
    })

    selectCareManagementServiceType('pcm')

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
      '99426 Monitoring Time unsatisfied',
      '99426 Monitoring Time satisfied',
      '99427 X1 unsatisfied',
      '99427 X1 satisfied',
      '99427 X2 unsatisfied',
      '99427 X2 satisfied'
    ]

    firstRowData.forEach((cell, index) => {
      cy.get('@headerColumns').eq(index).should('contain', cell)
    })
  })

  it('Cell values are correct', function () {
    cy.get('@reportTableBody').find('tr').as('tableBodyRows')

    const tableData = [
      ['85', '18', '67', '19', '66', '20', '65'],
      ['44', '0', '44', '0', '44', '1', '43'],
      ['28', '17', '11', '17', '11', '17', '11'],
      ['8', '1', '7', '1', '7', '1', '7'],
      ['5', '0', '5', '1', '4', '1', '4']
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
        expect(data[0]['Unique Patients']).to.equal('85')
        expect(data[0]['PCM Unique Episodes of Care']).to.equal('85')
        expect(data[0]['99426 Monitoring Time unsatisfied']).to.equal('18')
        expect(data[0]['99426 Monitoring Time satisfied']).to.equal('67')
        expect(data[0]['99427 X1 unsatisfied']).to.equal('19')
        expect(data[0]['99427 X1 satisfied']).to.equal('66')
        expect(data[0]['99427 X2 unsatisfied']).to.equal('20')
        expect(data[0]['99427 X2 satisfied']).to.equal('65')
      })
    })
  })
})
