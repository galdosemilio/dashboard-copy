import { standardSetup } from '../../../../support'
import { getCareManagementBillingRows } from '../../../../support/care-management'
import {
  allServicesData,
  ccmData,
  rpmData,
  rtmData
} from './monitoring-reports-data'

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

    careManagementTypeSelectModal('RPM')

    cy.readFile(`${Cypress.config('downloadsFolder')}/RPM_Dec_2019_1.csv`).then(
      (res) => {
        const csv = csvJSON(res)

        for (let i = 0; i < rpmData.length; i += 1) {
          Object.entries(rpmData[i]).forEach(([key, value]) => {
            checkCsvValues(csv, i, key, value)
          })
        }
      }
    )
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
    careManagementTypeSelectModal('CCM')

    cy.readFile(`${Cypress.config('downloadsFolder')}/CCM_Dec_2019_1.csv`).then(
      (res) => {
        const csv = csvJSON(res)

        for (let i = 0; i < ccmData.length; i += 1) {
          Object.entries(ccmData[i]).forEach(([key, value]) => {
            checkCsvValues(csv, i, key, value)
          })
        }
      }
    )
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
    careManagementTypeSelectModal('RTM')

    cy.readFile(`${Cypress.config('downloadsFolder')}/RTM_Dec_2019_1.csv`).then(
      (res) => {
        const csv = csvJSON(res)

        for (let i = 0; i < rtmData.length; i += 1) {
          Object.entries(rtmData[i]).forEach(([key, value]) => {
            checkCsvValues(csv, i, key, value)
          })
        }
      }
    )
  })

  it('ALL CSV exports correctly', function () {
    standardSetup({
      apiOverrides: [
        {
          url: '/1.0/warehouse/care-management/billing/snapshot**',
          fixture: 'api/warehouse/getAllBillingSnapshotMultiple'
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
    cy.get('app-monitoring-report-dialog')
      .find('.mat-select-trigger')
      .trigger('click')
      .wait(500)
    cy.get('.mat-option').contains(`ALL`).trigger('click').tick(1000)
    cy.get('app-monitoring-report-dialog').contains('Download').trigger('click')

    cy.readFile(
      `${Cypress.config('downloadsFolder')}/Monitoring_Report_Dec_2019_1.csv`
    ).then((res) => {
      const csv = csvJSON(res)

      for (let i = 0; i < allServicesData.length; i += 1) {
        Object.entries(allServicesData[i]).forEach(([key, value]) => {
          checkCsvValues(csv, i, key, value)
        })
      }
    })
  })
})

function checkCsvValues(csv, index, field: string, value: string) {
  expect(csv[index][field]).to.equal(value)
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

function careManagementTypeSelectModal(serviceType: string) {
  cy.get('app-monitoring-report-dialog')
    .find('.mat-select')
    .should('contain', serviceType)
  cy.get('app-monitoring-report-dialog').contains('Download').trigger('click')
}
