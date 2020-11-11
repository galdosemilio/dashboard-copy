import { standardSetup } from './../../../support'
import {
  attemptToDisableRpm,
  attemptToDownloadPatientReport,
  attemptToEnableRpm,
  openRPMDialog,
  openRPMReportDialog
} from './utils'

describe('Patient profile -> dashboard -> rpm', function () {
  beforeEach(() => {
    cy.setOrganization('mdteam')
    cy.setTimezone('et')
  })

  it('Shows inaccessible provider properly', function () {
    standardSetup(undefined, [
      {
        url: '/1.0/rpm/state**',
        fixture: 'fixture:/api/rpm/rpmStateEnabledEntries'
      }
    ])

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    cy.get('.ccr-dashboard', {
      timeout: 30000
    })

    cy.route({
      method: 'GET',
      url: `/2.0/account/${Cypress.env('providerId')}`,
      status: 403,
      response: {}
    })

    openRPMDialog()

    cy.get('mat-dialog-container').should('contain', 'Inaccessible Coach')
    cy.wait(5000)
  })

  it('Allows RPM enabling', function () {
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    cy.get('.ccr-dashboard', {
      timeout: 30000
    })

    openRPMDialog()
    attemptToEnableRpm()

    cy.wait('@rpmStatePostRequest').should((xhr) => {
      expect(xhr.request.body.account).to.equal('3')
      expect(xhr.request.body.isActive).to.equal(true)
      expect(xhr.request.body.organization).to.equal('1')
      Object.values(xhr.request.body.conditions).forEach((condition) =>
        expect(condition).to.equal(true)
      )
    })

    cy.wait(5000)
  })

  it('Allows RPM disabling', function () {
    standardSetup(undefined, [
      {
        url: '/1.0/rpm/state**',
        fixture: 'fixture:/api/rpm/rpmStateEnabledEntries'
      }
    ])

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    cy.get('.ccr-dashboard', {
      timeout: 30000
    })

    openRPMDialog()
    attemptToDisableRpm()

    cy.wait('@rpmStatePostRequest').should((xhr) => {
      expect(xhr.request.body.account).to.equal('3')
      expect(xhr.request.body.isActive).to.equal(false)
      expect(xhr.request.body.organization).to.equal('1')
    })

    cy.wait(5000)
  })

  it('Properly fetches the RPM report (Excel)', function () {
    standardSetup(undefined, [
      {
        url: '/1.0/rpm/state**',
        fixture: 'fixture:/api/rpm/rpmStateEnabledEntries'
      }
    ])

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    cy.get('.ccr-dashboard', {
      timeout: 30000
    })

    cy.wait(3000)

    openRPMReportDialog()
    attemptToDownloadPatientReport('Excel')

    cy.wait('@rpmIndividualSummaryRequest').should((xhr) => {
      expect(xhr.request.headers.Accept).to.equal(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
    })
  })

  it('Properly fetches the RPM report (PDF)', function () {
    standardSetup(undefined, [
      {
        url: '/1.0/rpm/state**',
        fixture: 'fixture:/api/rpm/rpmStateEnabledEntries'
      }
    ])

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    cy.get('.ccr-dashboard', {
      timeout: 30000
    })

    cy.wait(3000)

    openRPMReportDialog()
    attemptToDownloadPatientReport('PDF')

    cy.wait('@rpmIndividualSummaryRequest').should((xhr) => {
      expect(xhr.request.headers.Accept).to.equal('application/pdf')
    })
  })

  it('The RPM download button is shown if RPM has never been enabled', function () {
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    cy.get('.ccr-dashboard', {
      timeout: 30000
    })

    cy.get('button').contains('Download Report').should('exist')
    cy.wait(2000)
  })

  it(`Shouldn't show the tracker if RPM is not enabled`, function () {
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    cy.get('.ccr-dashboard', {
      timeout: 30000
    })

    cy.get('app-rpm-tracker').should('not.exist')
    cy.wait(2000)
  })

  it("Should show NO TRACKING if the current code doesn't require monitoring time", function () {
    standardSetup(undefined, [
      {
        url: '/1.0/rpm/state**',
        fixture: 'fixture:/api/rpm/rpmStateEnabledEntries'
      }
    ])

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    cy.get('.ccr-dashboard', { timeout: 12000 })

    cy.get('app-rpm-tracker').should('contain', 'No Tracking')
  })

  it('Should track time if the current code requires monitoring time', function () {
    standardSetup(undefined, [
      {
        url: '/1.0/rpm/state**',
        fixture: 'fixture:/api/rpm/rpmStateEnabledEntries'
      },
      {
        url: '/3.0/warehouse/rpm/state/billing-summary?**',
        fixture: 'fixture:/api/warehouse/getRPMBillingOn99457'
      }
    ])

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    cy.get('.ccr-dashboard', { timeout: 12000 })

    cy.wait(4000)

    cy.tick(10000)

    cy.get('app-rpm-tracker').should('not.contain', 'No Tracking')
    cy.get('app-rpm-tracker').should('contain', '00:')
    cy.get('app-rpm-tracker').should('contain', '99457')
  })

  it('Attempts to commit the tracked time when the 20-minute span is completed for 99457', function () {
    standardSetup(undefined, [
      {
        url: '/1.0/rpm/state**',
        fixture: 'fixture:/api/rpm/rpmStateEnabledEntries'
      },
      {
        url: '/3.0/warehouse/rpm/state/billing-summary?**',
        fixture: 'fixture:/api/warehouse/getRPMBillingOn99458'
      }
    ])

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    cy.get('.ccr-dashboard', { timeout: 12000 })

    cy.wait(4000)

    cy.tick(10000)

    cy.get('app-rpm-tracker').should('not.contain', 'No Tracking')
    cy.get('app-rpm-tracker').should('contain', '19:50')
    cy.get('app-rpm-tracker').should('contain', '99457')
    cy.get('app-rpm-tracker').should('contain', '99458')
    cy.get('app-rpm-tracker').find('mat-icon').should('have.length', 3)

    cy.tick(20000)

    cy.wait('@accountActivityPostRequest')
    cy.wait(2000)
  })

  it('Properly shows the RPM status on the panel', function () {
    standardSetup(undefined, [
      {
        url: '/1.0/rpm/state**',
        fixture: 'fixture:/api/rpm/rpmStateEnabledEntries'
      }
    ])

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    cy.get('.ccr-dashboard', { timeout: 12000 })

    cy.tick(10000)

    cy.wait(3000)

    cy.get('app-rpm-tracker').find('button').click({ force: true })

    cy.tick(1000)

    cy.get('app-rpm-status-panel').should('contain', 'Eligible')
    cy.get('app-rpm-status-panel').should('contain', '189d')
    cy.get('app-rpm-status-panel').should('contain', '20m')
    cy.get('app-rpm-status-panel').should('contain', '1')
  })
})
