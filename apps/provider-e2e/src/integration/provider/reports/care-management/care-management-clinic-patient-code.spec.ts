import { standardSetup } from '../../../../support'

describe('Reports -> Care Managment -> Clinic Patient Code Report', function () {
  beforeEach(() => {
    cy.setTimezone('et')
  })

  it('Sums a maximum of one 99454 interation per month, even if two are billable', function () {
    standardSetup({
      startDate: Date.UTC(2023, 6, 1),
      apiOverrides: [
        {
          url: '/1.0/warehouse/care-management/billing/snapshot**',
          fixture:
            'api/warehouse/getRPMBillingSnapshot-2023-06-29-multiple-99454.json'
        }
      ]
    })
    cy.visit(`/reports/rpm/clinic-patient-code`)

    cy.get('[data-cy="clinic-patient-code-report-table"]').as('reportTable')

    cy.tick(10000)

    cy.get('@reportTable').get('tr').eq(0).as('firstRow')

    const firstRowData = [
      '-',
      'Sum',
      '20',
      '19',
      '1',
      '0',
      '20',
      '3',
      '17',
      '3',
      '17',
      '3',
      '17',
      '3',
      '17',
      '4',
      '16'
    ]

    firstRowData.forEach((td, index) => {
      cy.get('@firstRow').get('td').eq(index).should('contain', td)
    })
  })

  it('99457 and 99458 last eligible billing will count if in current month', function () {
    standardSetup({
      startDate: Date.UTC(2023, 6, 1),
      apiOverrides: [
        {
          url: '/1.0/warehouse/care-management/billing/snapshot**',
          fixture:
            'api/warehouse/getRPMBillingSnapshot-2023-06-29-99457-99458-last-eligible.json'
        }
      ]
    })
    cy.visit(`/reports/rpm/clinic-patient-code`)

    cy.get('[data-cy="clinic-patient-code-report-table"]').as('reportTable')

    cy.tick(10000)

    cy.get('@reportTable').get('tr').eq(0).as('firstRow')

    const firstRowData = [
      '-',
      'Sum',
      '1',
      '0',
      '1',
      '0',
      '1',
      '0',
      '1',
      '0',
      '1',
      '0',
      '1',
      '1',
      '0',
      '1',
      '0'
    ]

    firstRowData.forEach((td, index) => {
      cy.get('@firstRow').get('td').eq(index).should('contain', td)
    })
  })

  it('Shows "Sum" row with correct data for 2023-06-28', function () {
    standardSetup({
      startDate: Date.UTC(2023, 5, 29),
      apiOverrides: [
        {
          url: '/1.0/warehouse/care-management/billing/snapshot**',
          fixture: 'api/warehouse/getRPMBillingSnapshot-2023-06-29'
        }
      ]
    })
    cy.visit(`/reports/rpm/clinic-patient-code`)

    cy.get('[data-cy="clinic-patient-code-report-table"]').as('reportTable')

    cy.tick(10000)

    cy.get('@reportTable').get('tr').eq(0).as('firstRow')

    const firstRowData = [
      '-',
      'Sum',
      '20',
      '19',
      '1',
      '0',
      '20',
      '3',
      '17',
      '4',
      '16',
      '4',
      '16',
      '3',
      '17',
      '4',
      '16'
    ]

    firstRowData.forEach((td, index) => {
      cy.get('@firstRow').get('td').eq(index).should('contain', td)
    })
  })

  it('Shows "Sum" row with correct data for 2023-06-30', function () {
    standardSetup({
      startDate: Date.UTC(2023, 5, 29),
      apiOverrides: [
        {
          url: '/1.0/warehouse/care-management/billing/snapshot**',
          fixture: 'api/warehouse/getRPMBillingSnapshot-2023-07-01'
        }
      ]
    })
    cy.visit(`/reports/rpm/clinic-patient-code`)

    cy.get('[data-cy="clinic-patient-code-report-table"]').as('reportTable')

    cy.tick(10000)

    cy.get('@reportTable').get('tr').eq(0).as('firstRow')

    const firstRowData = [
      '-',
      'Sum',
      '20',
      '20',
      '0',
      '0',
      '20',
      '3',
      '17',
      '3',
      '17',
      '3',
      '17',
      '3',
      '17',
      '3',
      '17'
    ]

    firstRowData.forEach((td, index) => {
      cy.get('@firstRow').get('td').eq(index).should('contain', td)
    })
  })

  it('Shows Sum correctly for different orgs', function () {
    standardSetup({
      startDate: Date.UTC(2023, 5, 29),
      apiOverrides: [
        {
          url: '/1.0/warehouse/care-management/billing/snapshot**',
          fixture: 'api/warehouse/getRPMBillingSnapshotMultipleOrgs'
        }
      ]
    })
    cy.visit(`/reports/rpm/clinic-patient-code`)

    cy.get('[data-cy="clinic-patient-code-report-table"]').as('reportTable')

    cy.tick(10000)

    cy.get('@reportTable').get('tr').eq(0).as('firstRow')

    const firstRowData = [
      '-',
      'Sum',
      '20',
      '19',
      '1',
      '0',
      '20',
      '3',
      '17',
      '3',
      '17',
      '3',
      '17',
      '3',
      '17',
      '4',
      '16'
    ]

    firstRowData.forEach((td, index) => {
      cy.get('@firstRow').get('td').eq(index).should('contain', td)
    })
  })

  it('Download CSV report and contains correct data', function () {
    standardSetup({
      startDate: Date.UTC(2023, 6, 1),
      apiOverrides: [
        {
          url: '/1.0/warehouse/care-management/billing/snapshot**',
          fixture: 'api/warehouse/getRPMBillingSnapshot-2023-07-01'
        }
      ]
    })
    cy.visit(`/reports/rpm/clinic-patient-code`)
    cy.get('[data-cy="clinic-patient-code-report-table"]').as('reportTable')
    cy.tick(10000)
    cy.get('@reportTable').get('tr').eq(0).as('firstRow')
    cy.get('[data-cy="download-csv-button"]')
      .should('be.visible')
      .should('contain', 'Export CSV')
      .click()

    cy.readFile(
      Cypress.config().downloadsFolder +
        '/clinic_patient_code_report_2023_06_30_csv.csv'
    ).then((data) => {
      cy.task('parseCsv', data).then((data) => {
        expect(data[0]['Unique Patients']).to.equal('20')
        expect(data[0]['RPM Unique Episodes of Care']).to.equal('20')
        expect(data[0]['ID']).to.equal('7041')
        expect(data[0]['Name']).to.equal('Alaska Premier Health - RPM')
        expect(data[0]['99453 unsatisfied']).to.equal('20')
        expect(data[0]['99453 satisfied']).to.equal('0')
        expect(data[0]['99454 unsatisfied']).to.equal('0')
        expect(data[0]['99454 satisfied']).to.equal('20')
        expect(data[0]['99457 Live Interaction satisfied']).to.equal('17')
        expect(data[0]['99457 Live Interaction unsatisfied']).to.equal('3')
        expect(data[0]['99457 Monitoring Time satisfied']).to.equal('17')
        expect(data[0]['99457 Monitoring Time unsatisfied']).to.equal('3')
        expect(data[0]['99457 satisfied']).to.equal('17')
        expect(data[0]['99457 unsatisfied']).to.equal('3')
        expect(data[0]['99458 X1 satisfied']).to.equal('17')
        expect(data[0]['99458 X1 unsatisfied']).to.equal('3')
        expect(data[0]['99458 X2 satisfied']).to.equal('17')
        expect(data[0]['99458 X2 unsatisfied']).to.equal('3')
      })
    })
  })
})
