import { standardSetup } from '../../../../support'
import { checkList } from '../../../helpers'

describe('Patient profile -> more -> submenu (cmwl)', function () {
  before(() => {
    cy.setOrganization('cmwl')
    standardSetup()
  })

  it('Correct submenu links', function () {
    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings`)

    cy.get('app-dieter-settings', {
      timeout: 12000
    })
      .find('li')
      .as('menuLinks')

    checkList('@menuLinks', [
      'Profile',
      'Addresses',
      'Phases',
      'Devices',
      'Forms',
      'Communications',
      'Clinics',
      'File Vault',
      'Login History',
      'Meetings',
      'Goals'
    ])

    // A bit of a hack - this component loads very late, but cypress will continue loading the page between spec files.  So, the component loads (and the API call is made) during a gray area where no api stub/intercepts are active.  So, waiting for it to load forces the spec to pass.
    cy.get('app-rpm', {
      timeout: 12000
    })
    cy.wait('@careManagementStates')
  })
})
