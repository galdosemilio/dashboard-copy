import { standardSetup } from '../../../../support'
import { getCareManagementBillingRows } from '../../../../support/care-management'

const billingCodes = {
  '1': ['99453', '99454', '99457', '99458 (1)', '99458 (2)'],
  '2': ['99490', '99439 (1)', '99439 (2)'],
  '3': ['98975', '98977', '98980', '98981 (1)', '98981 (2)'],
  '4': ['99426', '99427 (1)', '99427 (2)'],
  '5': ['99484']
}

const checkBillingCodes = (serviceTypeId: string) => {
  const codes = billingCodes[serviceTypeId]
  if (!codes) {
    return
  }

  for (let i = 0; i < codes.length; i += 1) {
    cy.get('@codeCells').eq(i).should('contain', codes[i])
  }

  cy.get('@codeCells').contains('-DMO').should('not.exist')
}

describe('Reports -> RPM -> Care Management Billing Table', function () {
  beforeEach(() => {
    cy.setTimezone('et')
  })

  it('Date selector shows as expected', function () {
    standardSetup()
    cy.visit(`/reports/rpm/billing`)
    cy.tick(1000)
    cy.get('app-report-controls').contains('Tuesday, December 31, 2019')
  })

  it('Table shows RPM billing data with proper names: no pagination', function () {
    standardSetup()
    getCareManagementBillingRows()

    cy.get('@careManagementBillingRows').should('have.length', 5)

    cy.get('@careManagementBillingRows')
      .eq(2)
      .should('contain', 'Eric')
      .should('contain', 'Di Bari')

    cy.get('@careManagementBillingRows')
      .eq(2)
      .find('td')
      .eq(6)
      .should('contain', 'test')

    cy.get('@careManagementBillingRows')
      .eq(0)
      .should('contain', 'Lascario')
      .should('contain', 'Pacheco')

    cy.get('[data-cy="device-type-heading"]').should('contain', 'Device Type')

    checkBillingCodes('1')

    cy.get('ccr-paginator')
      .find('button[aria-label="Previous page"][disabled="true"]')
      .should('have.length', 1)

    cy.get('ccr-paginator')
      .find('button[aria-label="Next page"][disabled="true"]')
      .should('have.length', 1)
  })

  it('should properly preserve the paginated page when clicking on patient link', function () {
    standardSetup({
      apiOverrides: [
        {
          url: '/1.0/warehouse/care-management/billing/snapshot**',
          fixture: 'api/warehouse/getRPMBillingSnapshot-2023-07-01'
        }
      ]
    })

    getCareManagementBillingRows()
    cy.get('[data-cy="page-size-selector"]').select('10')
    cy.wait('@careManagementBillingSnapshot')
    cy.tick(1000)
    cy.get('button[aria-label="Next page"]').click()
    cy.get('@careManagementBillingRows')
      .eq(0)
      .find('.first-name-cell span')
      .click()
    cy.go('back')
    getCareManagementBillingRows()

    cy.get('@careManagementBillingRows')
      .eq(0)
      .find('.id-cell')
      .should('contain', '11')
  })

  it('Table shows RTM billing data with proper names: no pagination', function () {
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

    checkBillingCodes('3')
    cy.get('table').find('th').eq(5).should('contain', 'Device Type')
    cy.get('@careManagementBillingRows').should('have.length', 5)
  })

  it('Table shows CCM billing data with proper names: no pagination', function () {
    standardSetup({
      apiOverrides: [
        {
          url: '/1.0/warehouse/care-management/billing/snapshot**',
          fixture: 'api/warehouse/getCCMBillingSnapshot'
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

    checkBillingCodes('2')

    cy.get('table').find('th').eq(5).should('not.contain', 'Device Type')
    cy.get('@careManagementBillingRows').should('have.length', 1)
  })

  it('Table shows BHI billing data with proper names: no pagination', function () {
    standardSetup({
      apiOverrides: [
        {
          url: '/1.0/warehouse/care-management/billing/snapshot**',
          fixture: 'api/warehouse/getBHIBillingSnapshot'
        }
      ]
    })

    getCareManagementBillingRows({
      serviceType: {
        id: '5',
        name: 'BHI',
        code: 'bhi'
      }
    })

    checkBillingCodes('5')

    cy.get('table').find('th').eq(5).should('not.contain', 'Device Type')
    cy.get('@careManagementBillingRows').should('have.length', 2)
  })

  it('Table shows PCM billing data with proper names: no pagination', function () {
    standardSetup({
      apiOverrides: [
        {
          url: '/1.0/warehouse/care-management/billing/snapshot**',
          fixture: 'api/warehouse/getPCMBillingSnapshot'
        }
      ]
    })

    getCareManagementBillingRows({
      serviceType: {
        id: '4',
        name: 'PCM',
        code: 'pcm'
      }
    })

    checkBillingCodes('4')
    cy.get('table').find('th').eq(5).should('not.contain', 'Device Type')
    cy.get('@careManagementBillingRows').should('have.length', 1)
  })

  it('Shows the total count underneath the title', function () {
    standardSetup()

    getCareManagementBillingRows()

    cy.get('@careManagementBillingRows').should('have.length', 5)
    cy.get('app-reports-rpm-billing')
      .find('.count')
      .should('contain', '5 Patients')
  })

  it('Shows error message for no selected clinic', function () {
    standardSetup()

    getCareManagementBillingRows({
      selectedClinicId: null,
      getTable: false
    })

    cy.get('ccr-datasource-overlay').should('contain', 'Please select a clinic')
  })

  it('Handles inactive results', function () {
    standardSetup({
      apiOverrides: [
        {
          url: '/1.0/warehouse/care-management/billing/snapshot**',
          fixture: 'api/warehouse/getInactiveBillingSnapshot'
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

    cy.get('table').find('th').eq(5).should('not.contain', 'Device Type')
    checkBillingCodes('2')
  })

  it('Handles empty results', function () {
    standardSetup({
      apiOverrides: [
        {
          url: '/1.0/warehouse/care-management/billing/snapshot**',
          fixture: 'api/warehouse/getEmptyBillingSnapshot'
        }
      ]
    })

    getCareManagementBillingRows({
      getTable: false
    })

    cy.get('[data-cy="datasource-overlay-error"]').should(
      'contain',
      'No matching patients exist.'
    )
  })
})
