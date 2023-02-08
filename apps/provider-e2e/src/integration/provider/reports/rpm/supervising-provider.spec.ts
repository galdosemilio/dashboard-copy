import { standardSetup } from './../../../../support'
import {
  confirmMessageNoSupervisingProvidersAvailable,
  confirmSupervisingProviderName,
  confirmPayloadOnSupervisingProviderUpdate
} from '../../patient/dashboard/utils'

describe('Reports -> RPM -> RPM Billing -> Change Supervising Provider', function () {
  beforeEach(() => {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/reports/rpm/billing`)

    cy.tick(100)
  })

  it('Change provider modal is shown on edit icon click', function () {
    openDialogToChangeProvider()
    confirmSupervisingProviderName('Mary Jane')
  })

  it('Proper message is shown when no supervising providers are available to change to', function () {
    confirmMessageNoSupervisingProvidersAvailable(openDialogToChangeProvider)
  })

  it('Correct payload is passed when supervising provider is changed', function () {
    openDialogToChangeProvider()
    confirmPayloadOnSupervisingProviderUpdate()
  })
})

function openDialogToChangeProvider(): void {
  cy.get('[data-cy="rpm-billing-report-change-supervising-provider"]')
    .eq(0)
    .trigger('click')
}
