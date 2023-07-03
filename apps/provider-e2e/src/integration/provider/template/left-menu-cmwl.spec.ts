import { checkList } from '../../helpers'
import { standardSetup } from './../../../support'

describe('Lefthand menu (CMWL)', function () {
  beforeEach(() => {
    cy.setOrganization('cmwl')
    standardSetup()
  })

  it('Test custom case: CMWL, all proper links show', function () {
    cy.visit('/dashboard')

    cy.get('app-menu', {
      timeout: 12000
    })
      .find('app-sidenav-item')
      .not('.hidden')
      .as('menuLinks')

    checkList('@menuLinks', [
      'Dashboard',
      'Accounts',
      'Patients',
      'Coaches',
      'Clinics',
      'Schedule',
      'List View',
      'Calendar View',
      'Set Availability',
      'Messages',
      'Digital Library',
      'Alerts',
      'Notifications',
      'Settings',
      'Reports',
      'RPM',
      'Communications',
      'Resources',
      'Updates',
      'Schedule Support Call',
      'Email Support',
      'FAQ & Support Guides'
    ])

    // Adding for Cypress issue where page continues to load after spec is done
    cy.get('ccr-dieters-table', {
      timeout: 12000
    })
  })
})
