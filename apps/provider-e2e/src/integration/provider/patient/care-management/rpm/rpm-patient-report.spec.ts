import { standardSetup } from '../../../../../support'
import { ApiOverrideEntry } from '../../../../../support/api'
const STORAGE_ACTIVE_CARE_MANAGEMENT_SERVICE_TYPE =
  'ccrActiveCareManagementServiceType'

describe('Patient profile -> dashboard -> download reports modal', function () {
  beforeEach(() => {
    cy.setOrganization('mdteam')
    localStorage.removeItem(STORAGE_ACTIVE_CARE_MANAGEMENT_SERVICE_TYPE)
  })

  it('should show only active service types and set default without selected service type', () => {
    checkServiceSelection(['RPM', 'CCM'], { id: '1', name: 'RPM' })
  })

  it('should show only active service types and set selected service type', () => {
    localStorage.setItem(STORAGE_ACTIVE_CARE_MANAGEMENT_SERVICE_TYPE, '2')

    checkServiceSelection(['RPM', 'CCM'], { id: '2', name: 'CCM' })
  })

  it('should show only active service types and set default with selected service type is not in active service types', () => {
    localStorage.setItem(STORAGE_ACTIVE_CARE_MANAGEMENT_SERVICE_TYPE, '3')

    checkServiceSelection(['RPM', 'CCM'], { id: '1', name: 'RPM' })
  })

  it('should not show service type', () => {
    checkServiceSelection([], undefined, [
      {
        url: '/1.0/care-management/state?**',
        fixture: `api/general/emptyDataEmptyPagination`
      }
    ])
  })
})

function checkServiceSelection(
  serviceTypes: string[],
  serviceType?: { id: string; name: string },
  apiOverrides?: ApiOverrideEntry[]
) {
  standardSetup({ apiOverrides })
  cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)
  cy.get('.ccr-dashboard').get('[data-cy="download-report-button"]').click()

  if (serviceType) {
    cy.get('[data-cy="patient-reports-service-type"]')
      .find('mat-select')
      .should('contain', serviceType.name)

    cy.get('[data-cy="patient-reports-service-type"]')
      .find('mat-select')
      .click()

    cy.tick(1000)

    for (let i = 0; i < serviceTypes.length; i += 1) {
      cy.get('mat-option').eq(i).contains(serviceTypes[i])
    }

    cy.get('body').click(0, 0)
  } else {
    cy.tick(1000)

    cy.get('[data-cy="patient-reports-service-type"]').should('not.exist')
  }

  cy.get('[data-cy="download-button"]').click()

  cy.wait('@downloadCareManagementReports').should((xhr) => {
    expect(xhr.response.statusCode).to.equal(200)

    if (serviceType) {
      expect(xhr.request.query.serviceType).to.equal(serviceType.id)
    } else {
      expect(xhr.request.query.serviceType).to.be.undefined
    }
  })
}
