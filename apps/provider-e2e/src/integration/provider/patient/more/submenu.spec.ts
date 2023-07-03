import { standardSetup } from '../../../../support'
import { checkList } from '../../../helpers'

describe('Patient profile -> more -> submenu (standard)', function () {
  it('Correct submenu links', function () {
    cy.setOrganization('ccr')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings`)

    cy.get('app-dieter-settings').find('li').as('menuLinks')

    checkList('@menuLinks', [
      'Profile',
      'Addresses',
      'Phases',
      'Devices',
      'Forms',
      'Sequences',
      'Communications',
      'Clinics',
      'File Vault',
      'Login History',
      'Meetings',
      'Goals'
    ])

    cy.wait(2000)
  })

  it('Correct submenu links - exclude File Vault', function () {
    cy.setOrganization('ccr')
    standardSetup({
      apiOverrides: [
        {
          url: '/1.0/content/vault/preference?organization=**',
          fixture: 'api/filevault/getOrgPreference-disabled'
        }
      ]
    })

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings`)

    cy.get('app-dieter-settings').find('li').as('menuLinks')

    checkList('@menuLinks', [
      'Profile',
      'Addresses',
      'Phases',
      'Devices',
      'Forms',
      'Sequences',
      'Communications',
      'Clinics',
      'Login History',
      'Meetings',
      'Goals'
    ])
    cy.wait(2000)
  })
})
