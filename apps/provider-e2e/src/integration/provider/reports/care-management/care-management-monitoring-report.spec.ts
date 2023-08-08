import { standardSetup } from '../../../../support'
import { getCareManagementBillingRows } from '../../../../support/care-management'

describe('Reports -> RPM -> Export Monitoring Report', function () {
  beforeEach(() => {
    cy.setTimezone('et')
  })

  it('RPM CSV exports correctly', function () {
    standardSetup({
      apiOverrides: [
        {
          url: '/1.0/warehouse/care-management/billing/snapshot**',
          fixture: 'api/warehouse/getRPMBillingSnapshot-Codes'
        }
      ]
    })

    getCareManagementBillingRows()

    cy.get('[data-cy="export-monitoring-report-button"]').click()

    cy.readFile(
      `${Cypress.config('downloadsFolder')}/RPM_Dec_2019_csv.csv`
    ).then((res) => {
      const csv = csvJSON(res)

      checkRPMAndRTMCsv(csv, ['99457', '99458'])
    })
  })

  it('CCM CSV exports correctly', function () {
    standardSetup({
      apiOverrides: [
        {
          url: '/1.0/warehouse/care-management/billing/snapshot**',
          fixture: 'api/warehouse/getCCMBillingSnapshotMultiple'
        }
      ]
    })

    getCareManagementBillingRows({
      serviceType: {
        id: '2',
        name: 'CCM',
        code: 'ccm'
      }
    })

    cy.get('[data-cy="export-monitoring-report-button"]').click()

    cy.readFile(
      `${Cypress.config('downloadsFolder')}/CCM_Dec_2019_csv.csv`
    ).then((res) => {
      const csv = csvJSON(res)

      checkCsvData(csv, 0, 12, 'N/A')
      checkCsvData(
        csv,
        0,
        13,
        '30 more calendar days; 20 minutes more of monitoring needed'
      )
      checkCsvData(csv, 0, 14, 'N/A')
      checkCsvData(
        csv,
        0,
        15,
        '99490 requirements not satisfied; 30 more calendar days; 20 minutes more of monitoring needed'
      )
      checkCsvData(csv, 0, 16, 'N/A')
      checkCsvData(
        csv,
        0,
        17,
        '99439 requirements not satisfied; 30 more calendar days; 20 minutes more of monitoring needed'
      )

      checkCsvData(csv, 1, 12, '01/31/2020')
      checkCsvData(csv, 1, 13, 'N/A')
      checkCsvData(csv, 1, 14, 'N/A')
      checkCsvData(
        csv,
        1,
        15,
        '30 more calendar days; 15 minutes more of monitoring needed'
      )
      checkCsvData(csv, 1, 16, 'N/A')
      checkCsvData(
        csv,
        1,
        17,
        '99439 requirements not satisfied; 30 more calendar days; 20 minutes more of monitoring needed'
      )

      checkCsvData(csv, 2, 12, '01/31/2020')
      checkCsvData(csv, 2, 13, 'N/A')
      checkCsvData(csv, 2, 14, '01/31/2020')
      checkCsvData(csv, 2, 15, 'N/A')
      checkCsvData(csv, 2, 16, 'N/A')
      checkCsvData(csv, 2, 17, '10 minutes more of monitoring needed')

      checkCsvData(csv, 3, 12, '02/01/2020')
      checkCsvData(csv, 3, 13, '01/31/2020')
      checkCsvData(csv, 3, 14, 'N/A')
      checkCsvData(csv, 3, 15, '01/31/2020')
      checkCsvData(csv, 3, 16, 'N/A')
      checkCsvData(csv, 3, 17, '01/31/2020')
    })
  })

  it('RTM CSV exports correctly', function () {
    standardSetup({
      apiOverrides: [
        {
          url: '/1.0/warehouse/care-management/billing/snapshot**',
          fixture: 'api/warehouse/getRTMBillingSnapshot'
        }
      ]
    })

    getCareManagementBillingRows({
      serviceType: {
        id: '3',
        name: 'RTM',
        code: 'rtm'
      }
    })

    cy.get('[data-cy="export-monitoring-report-button"]').click()

    cy.readFile(
      `${Cypress.config('downloadsFolder')}/RTM_Dec_2019_csv.csv`
    ).then((res) => {
      const csv = csvJSON(res)

      checkRPMAndRTMCsv(csv, ['98980', '98981'])
    })
  })
})

function checkRPMAndRTMCsv(csv, requirements: string[]) {
  checkCsvData(csv, 0, 12, 'N/A')
  checkCsvData(csv, 0, 13, '30 more calendar days')
  checkCsvData(csv, 0, 14, 'N/A')
  checkCsvData(
    csv,
    0,
    15,
    '30 more calendar days; 15 more device transmissions needed'
  )
  checkCsvData(csv, 0, 16, 'N/A')
  checkCsvData(
    csv,
    0,
    17,
    '30 more calendar days; 20 minutes more of monitoring needed; 1 more live interactions (call/visit) needed'
  )
  checkCsvData(csv, 0, 18, 'N/A')
  checkCsvData(
    csv,
    0,
    19,
    `${requirements[0]} requirements not satisfied; 30 more calendar days; 20 minutes more of monitoring needed`
  )
  checkCsvData(csv, 0, 20, 'N/A')
  checkCsvData(
    csv,
    0,
    21,
    `${requirements[1]} requirements not satisfied; 30 more calendar days; 20 minutes more of monitoring needed`
  )

  checkCsvData(csv, 1, 12, '01/31/2020')
  checkCsvData(csv, 1, 13, 'N/A')
  checkCsvData(csv, 1, 14, 'N/A')
  checkCsvData(
    csv,
    1,
    15,
    '20 more calendar days; 15 more device transmissions needed'
  )
  checkCsvData(csv, 1, 16, 'N/A')
  checkCsvData(
    csv,
    1,
    17,
    '30 more calendar days; 20 minutes more of monitoring needed; 1 more live interactions (call/visit) needed'
  )
  checkCsvData(csv, 1, 18, 'N/A')
  checkCsvData(
    csv,
    1,
    19,
    `${requirements[0]} requirements not satisfied; 30 more calendar days; 20 minutes more of monitoring needed`
  )
  checkCsvData(csv, 1, 20, 'N/A')
  checkCsvData(
    csv,
    1,
    21,
    `${requirements[1]} requirements not satisfied; 30 more calendar days; 20 minutes more of monitoring needed`
  )

  checkCsvData(csv, 2, 12, '01/31/2020')
  checkCsvData(csv, 2, 13, 'N/A')
  checkCsvData(csv, 2, 14, '01/31/2020')
  checkCsvData(csv, 2, 15, 'N/A')
  checkCsvData(csv, 2, 16, 'N/A')
  checkCsvData(
    csv,
    2,
    17,
    '20 more calendar days; 10 minutes more of monitoring needed; 1 more live interactions (call/visit) needed'
  )
  checkCsvData(csv, 2, 18, 'N/A')
  checkCsvData(
    csv,
    2,
    19,
    `${requirements[0]} requirements not satisfied; 30 more calendar days; 20 minutes more of monitoring needed`
  )
  checkCsvData(csv, 2, 20, 'N/A')
  checkCsvData(
    csv,
    2,
    21,
    `${requirements[1]} requirements not satisfied; 30 more calendar days; 20 minutes more of monitoring needed`
  )

  checkCsvData(csv, 3, 12, '01/31/2020')
  checkCsvData(csv, 3, 13, 'N/A')
  checkCsvData(csv, 3, 14, '01/31/2020')
  checkCsvData(csv, 3, 15, 'N/A')
  checkCsvData(csv, 3, 16, '01/31/2020')
  checkCsvData(csv, 3, 17, 'N/A')
  checkCsvData(csv, 3, 18, '01/31/2020')
  checkCsvData(csv, 3, 19, 'N/A')
  checkCsvData(csv, 3, 20, 'N/A')
  checkCsvData(csv, 3, 21, '20 minutes more of monitoring needed')

  checkCsvData(csv, 4, 12, '01/31/2020')
  checkCsvData(csv, 4, 13, 'N/A')
  checkCsvData(csv, 4, 14, '01/31/2020')
  checkCsvData(csv, 4, 15, 'N/A')
  checkCsvData(csv, 4, 16, '01/31/2020')
  checkCsvData(csv, 4, 17, 'N/A')
  checkCsvData(csv, 4, 18, '01/31/2020')
  checkCsvData(csv, 4, 19, 'N/A')
  checkCsvData(csv, 4, 20, '01/31/2020')
  checkCsvData(csv, 4, 21, 'N/A')
}

function checkCsvData(csv, index: number, column: number, value: string) {
  expect(Object.values(csv[index])[column]).to.equal(value)
}

function csvJSON(csv) {
  const lines = csv.split('\n')
  const result = []
  const topHeaders = lines[0].split(',')
  const headers = lines[2].split(',')

  for (let i = 3; i < lines.length - 2; i++) {
    if (!lines[i]) continue
    const obj = {}
    const currentline = lines[i].split(',')
    for (let j = 0; j < headers.length; j++) {
      let field = headers[j]
        ?.replace('"', '')
        .replace('"', '')
        .replace('\r', '')
      const topHeader = topHeaders[j + 1]
        ?.replace('"', '')
        .replace('"', '')
        .replace('\r', '')

      if (field !== 'ID' && topHeader) {
        field = `${field} ${topHeader}`
      }
      obj[field] = currentline[j]
        .replace('"', '')
        .replace('"', '')
        .replace('\r', '')
    }
    result.push(obj)
  }
  return result
}
