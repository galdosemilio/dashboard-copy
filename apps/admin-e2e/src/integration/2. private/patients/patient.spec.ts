import { standardSetup } from '../../../support'
import { syncThirdPartyService } from './utils'

describe('Patient Integrations Page', () => {
  beforeEach(() => {
    cy.setTimezone('et')
    standardSetup()
  })

  it('Allows force-syncing a device', () => {
    cy.visit(`/admin/accounts/patients/${Cypress.env('patientId')}`)

    syncThirdPartyService(0, 'google')

    syncThirdPartyService(1, 'fitbit')

    syncThirdPartyService(3, 'healthkit')
  })

  it('Shows an empty error message if there are no services', () => {
    standardSetup(true, undefined, [
      {
        url: '/2.0/measurement/device/sync?**',
        fixture: 'fixture:/api/general/emptyDataEmptyPagination'
      }
    ])

    cy.visit(`/admin/accounts/patients/${Cypress.env('patientId')}`)

    cy.get('ccr-integrations-device-sync').should(
      'contain',
      'No associated services'
    )
  })
})
