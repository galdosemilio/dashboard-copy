import { standardSetup } from '../../../../support'
import {
  setCareManagementServiceTypeToStorage,
  setSelectedClinicToStorage
} from '../../../../support/care-management'
import {
  confirmMessageNoSupervisingProvidersAvailable,
  confirmSupervisingProviderName,
  confirmPayloadOnSupervisingProviderUpdate
} from '../../patient/dashboard/utils'

describe('Reports -> RPM -> RPM Billing -> Change Supervising Provider', function () {
  beforeEach(() => {
    cy.setTimezone('et')
    standardSetup()

    setSelectedClinicToStorage('1')
    setCareManagementServiceTypeToStorage({
      id: '1',
      name: 'RPM',
      code: 'rpm'
    })
    cy.visit(`/reports/rpm/billing`)

    cy.tick(100)
  })

  it('Change provider modal is shown on edit icon click', function () {
    openDialogToChangeProvider()
    confirmSupervisingProviderName('Lascario Pacheco Arrieta')
  })

  it('Proper message is shown when no supervising providers are available to change to', function () {
    confirmMessageNoSupervisingProvidersAvailable(openDialogToChangeProvider)
  })

  it('Correct payload is passed when supervising provider is changed', function () {
    openDialogToChangeProvider()
    confirmPayloadOnSupervisingProviderUpdate()
  })

  it('Correct organization id is passed when supervising provider edit icon is clicked', function () {
    setSelectedClinicToStorage('7384')
    cy.tick(100)

    openDialogToChangeProvider()

    cy.wait('@careManagementStateAudit').should((xhr) => {
      expect(xhr.request.query.organization).to.equal('7384')
    })
  })
})

function openDialogToChangeProvider(): void {
  cy.get('[data-cy="rpm-billing-report-change-supervising-provider"]')
    .eq(0)
    .trigger('click')
}
