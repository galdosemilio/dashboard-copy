import { standardSetup } from '../../../../../support'
import {
  confirmMessageNoSupervisingProvidersAvailable,
  confirmPayloadOnSupervisingProviderUpdate,
  confirmSupervisingProviderName,
  openRPMDialog
} from '../../dashboard/utils'

describe('Patient profile -> rpm -> Change Supervising Provider state', function () {
  beforeEach(() => {
    cy.setOrganization('mdteam')
    cy.setTimezone('et')
    standardSetup({
      apiOverrides: [
        {
          url: '/1.0/rpm/state**',
          fixture: 'api/rpm/rpmStateEnabledEntries'
        }
      ]
    })
    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    cy.get('.ccr-dashboard', {
      timeout: 30000
    })
  })

  it('Correct supervising provider is shown', function () {
    openDialogToChangeProvider()
    confirmSupervisingProviderName('Eric Di Bari')
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
  openRPMDialog()

  cy.get('[data-cy="change-supervising-provider-button"]')
    .contains('Change Supervising Provider')
    .trigger('click')
}
