import { standardSetup } from '../../../../support'

describe('Reports -> RPM -> Care Management Billing', function () {
  const getRpmBillingRows = ({
    selectedClinicId = '1',
    getTable = true,
    serviceType = {
      id: '1',
      name: 'RPM',
      code: 'rpm'
    }
  } = {}) => {
    setSelectedClinicToStorage(selectedClinicId)
    setCareManagementServiceTypeToStorage(serviceType)
    cy.visit(`/reports/rpm/billing`)
    cy.tick(100)
    if (getTable) {
      cy.get('table', { timeout: 10000 }).find('tr').as('rpmBillingRows')
    }
  }
  const setCareManagementServiceTypeToStorage = (serviceType) => {
    window.localStorage.setItem('ccrCareManagementServiceType', serviceType.id)
  }

  const setSelectedClinicToStorage = (selectedClinicId) => {
    window.localStorage.setItem(
      'ccrRPMBillingsFilter',
      JSON.stringify({
        selectedClinicId
      })
    )
  }

  beforeEach(() => {
    cy.setTimezone('et')
  })

  it('Table shows RPM billing data with proper names: no pagination', function () {
    standardSetup()

    getRpmBillingRows()

    cy.get('@rpmBillingRows').should('have.length', 5)

    cy.get('@rpmBillingRows')
      .eq(2)
      .should('contain', 'Eric')
      .should('contain', 'Di Bari')

    cy.get('@rpmBillingRows').eq(2).find('td').eq(6).should('contain', 'test')

    cy.get('@rpmBillingRows')
      .eq(0)
      .should('contain', 'Lascario')
      .should('contain', 'Pacheco')

    cy.get('@rpmBillingRows')
      .eq(0)
      .find('td')
      .eq(11)
      .should('contain', '1247')
      .should('contain', '15')

    cy.get('[data-cy="device-type-heading"]').should('contain', 'Device Type')

    cy.get('table').find('.code-cell').as('codeCells')

    cy.get('@codeCells').eq(0).should('contain', '99453')
    cy.get('@codeCells').eq(1).should('contain', '99454')
    cy.get('@codeCells').eq(2).should('contain', '99457')
    cy.get('@codeCells').eq(3).should('contain', '99458 (1)')
    cy.get('@codeCells').eq(4).should('contain', '99458 (2)')

    cy.get('ccr-paginator')
      .find('button[aria-label="Previous page"][disabled="true"]')
      .should('have.length', 1)

    cy.get('ccr-paginator')
      .find('button[aria-label="Next page"][disabled="true"]')
      .should('have.length', 1)
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
    getRpmBillingRows({
      serviceType: {
        id: '3',
        name: 'RTM',
        code: 'rtm'
      }
    })

    cy.get('table').find('th').eq(5).should('contain', 'Device Type')
    cy.get('table').find('.code-cell').as('codeCells')

    cy.get('@codeCells').eq(0).should('contain', '98975')
    cy.get('@codeCells').eq(1).should('contain', '98977')
    cy.get('@codeCells').eq(2).should('contain', '98980')
    cy.get('@codeCells').eq(3).should('contain', '98981 (1)')
    cy.get('@codeCells').eq(4).should('contain', '98981 (2)')

    cy.get('@rpmBillingRows').should('have.length', 5)
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

    getRpmBillingRows({
      serviceType: {
        id: '2',
        name: 'CCM',
        code: 'ccm'
      }
    })

    cy.get('table').find('th').eq(5).should('not.contain', 'Device Type')
    cy.get('table').find('.code-cell').as('codeCells')

    cy.get('@codeCells').eq(0).should('contain', '99490')
    cy.get('@codeCells').eq(1).should('contain', '99439 (1)')
    cy.get('@codeCells').eq(2).should('contain', '99439 (2)')

    cy.get('@rpmBillingRows').should('have.length', 1)
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

    getRpmBillingRows({
      serviceType: {
        id: '5',
        name: 'BHI',
        code: 'bhi'
      }
    })

    cy.get('table').find('th').eq(5).should('not.contain', 'Device Type')
    cy.get('table').find('.code-cell').as('codeCells')

    cy.get('@codeCells').eq(0).should('contain', '99484')

    cy.get('@rpmBillingRows').should('have.length', 2)
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

    getRpmBillingRows({
      serviceType: {
        id: '4',
        name: 'PCM',
        code: 'pcm'
      }
    })

    cy.get('table').find('th').eq(5).should('not.contain', 'Device Type')
    cy.get('table').find('.code-cell').as('codeCells')

    cy.get('@codeCells').eq(0).should('contain', '99426')
    cy.get('@codeCells').eq(1).should('contain', '99427 (1)')
    cy.get('@codeCells').eq(2).should('contain', '99427 (2)')

    cy.get('@rpmBillingRows').should('have.length', 1)
  })

  it('Shows the total count underneath the title', function () {
    standardSetup()

    getRpmBillingRows()

    cy.get('@rpmBillingRows').should('have.length', 5)
    cy.get('app-reports-rpm-billing').find('h3').should('contain', '5 Patients')
  })

  it('Shows error message for no selected clinic', function () {
    standardSetup()

    getRpmBillingRows({
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

    getRpmBillingRows({
      serviceType: {
        id: '2',
        name: 'CCM',
        code: 'ccm'
      }
    })

    cy.get('table').find('th').eq(5).should('not.contain', 'Device Type')
    cy.get('table').find('.code-cell').as('codeCells')

    cy.get('@codeCells').eq(0).should('contain', '99490')
    cy.get('@codeCells').eq(1).should('contain', '99439')
  })
})
