import { standardSetup } from '../../../support'
import { checkList } from '../../helpers'

describe('Patient profile -> more -> submenu (cmwl)', function () {
  before(() => {
    cy.setOrganization('cmwl')
    standardSetup()
  })

  it('Correct main and sub links show', function () {
    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    // Main buttons
    cy.get('.ccr-tabs', {
      timeout: 12000
    })
      .find('a')
      .as('menuLinks')

    checkList('@menuLinks', [
      'Dashboard',
      'Journal',
      'Measurements',
      'Messages',
      'More'
    ])

    // Journal buttons
    cy.get('@menuLinks').eq(1).click()
    cy.get('.ccr-tabs-center', {
      timeout: 12000
    })
      .find('a')
      .as('subLinks')

    checkList('@subLinks', [
      'Food',
      'Supplements',
      'Water',
      'Exercise',
      'Micro'
    ])

    // More button
    cy.get('@menuLinks').eq(4).click()
    checkList('@subLinks', [
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
    cy.get('app-rpm')
    cy.wait('@careManagementStates')
  })
})
