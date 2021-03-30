import { standardSetup } from './../../../support'
import {
  attemptToDisableRpm,
  attemptToDownloadPatientReport,
  attemptToEditRPM,
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
        fixture: 'api/rpm/rpmStateEnabledEntries'
      }
    ])

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    cy.get('.ccr-dashboard', {
      timeout: 30000
    })

    cy.intercept('GET', `/2.0/account/${Cypress.env('providerId')}`, {
      statusCode: 403,
      body: {}
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

    cy.wait(1000)

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
        fixture: 'api/rpm/rpmStateEnabledEntries'
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

  it('Requests a note if the selected deactivation reason requires it', function () {
    standardSetup(undefined, [
      {
        url: '/1.0/rpm/state**',
        fixture: 'api/rpm/rpmStateEnabledEntries'
      }
    ])

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    cy.get('.ccr-dashboard', {
      timeout: 30000
    })

    openRPMDialog()
    attemptToDisableRpm('Other', 'test note')

    cy.wait('@rpmStatePostRequest').should((xhr) => {
      expect(xhr.request.body.account).to.equal('3')
      expect(xhr.request.body.isActive).to.equal(false)
      expect(xhr.request.body.organization).to.equal('1')
      expect(xhr.request.body.note).to.equal('test note')
    })

    cy.wait(5000)
  })

  it('Properly fetches the RPM report (Excel)', function () {
    standardSetup(undefined, [
      {
        url: '/1.0/rpm/state**',
        fixture: 'api/rpm/rpmStateEnabledEntries'
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
      expect(xhr.request.headers.accept).to.equal(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
    })
  })

  it('Properly fetches the RPM report (PDF)', function () {
    standardSetup(undefined, [
      {
        url: '/1.0/rpm/state**',
        fixture: 'api/rpm/rpmStateEnabledEntries'
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
      expect(xhr.request.headers.accept).to.equal('application/pdf')
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
        fixture: 'api/rpm/rpmStateEnabledEntries'
      }
    ])

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    cy.get('.ccr-dashboard', { timeout: 12000 })

    cy.get('app-rpm-tracker').should('contain', 'No Tracking').wait(3000)
  })

  it('Should track time if the current code requires monitoring time', function () {
    standardSetup(undefined, [
      {
        url: '/1.0/rpm/state**',
        fixture: 'api/rpm/rpmStateEnabledEntries'
      },
      {
        url: '/3.0/warehouse/rpm/state/billing-summary?**',
        fixture: 'api/warehouse/getRPMBillingOn99457'
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
        fixture: 'api/rpm/rpmStateEnabledEntries'
      },
      {
        url: '/3.0/warehouse/rpm/state/billing-summary?**',
        fixture: 'api/warehouse/getRPMBillingOn99458'
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

  it('Shows that the time monitoring is completed when all time has passed', function () {
    standardSetup(undefined, [
      {
        url: '/1.0/rpm/state**',
        fixture: 'api/rpm/rpmStateEnabledEntries'
      },
      {
        url: '/3.0/warehouse/rpm/state/billing-summary?**',
        fixture: 'api/warehouse/getRPMBillingComplete'
      }
    ])

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    cy.get('.ccr-dashboard', { timeout: 12000 })

    cy.wait(4000)

    cy.tick(10000)

    cy.get('app-rpm-tracker').should('not.contain', 'No Tracking')
    cy.get('app-rpm-tracker').should('contain', 'Time Monitoring Complete')
  })

  it('Properly shows the RPM status on the panel', function () {
    standardSetup(undefined, [
      {
        url: '/1.0/rpm/state**',
        fixture: 'api/rpm/rpmStateEnabledEntries'
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

  it('Shows the inactivity dialog after 15 minutes of inactivity pass, attempts to save the time and is hidden when there is a gesture', function () {
    standardSetup(undefined, [
      {
        url: '/1.0/rpm/state**',
        fixture: 'api/rpm/rpmStateEnabledEntries'
      }
    ])

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    cy.get('.ccr-dashboard', { timeout: 12000 })

    cy.tick(10000)

    cy.wait(3000)

    cy.tick(900000)

    cy.wait('@accountActivityPostRequest')

    cy.get('mat-dialog-container').should('contain', 'Time Tracking')

    cy.get('.ccr-dashboard').click({ force: true })
    cy.tick(1000)

    cy.get('mat-dialog-container').should('not.exist')
  })

  it('Allows a provider to edit the RPM entry during the first 24 hours', function () {
    standardSetup(undefined, [
      {
        url: '/1.0/rpm/state**',
        fixture: '/api/rpm/rpmStateEnabledBefore24'
      }
    ])

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    cy.get('.ccr-dashboard', { timeout: 12000 })

    openRPMDialog()
    attemptToEditRPM()

    cy.wait('@rpmDiagnosisPutRequest').should((xhr) => {
      expect(xhr.request.body.id).to.equal('1')
      expect(xhr.request.body.primary).to.equal('edited primary diagnosis')
      expect(xhr.request.body.secondary).to.equal('edited secondary diagnosis')
    })
  })

  it('Allows the provider to edit the entry ONCE after 24 hours have passed', function () {
    standardSetup(undefined, [
      {
        url: '/1.0/rpm/state**',
        fixture: '/api/rpm/rpmStateEnabledEntries'
      }
    ])

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    cy.get('.ccr-dashboard', { timeout: 12000 })

    openRPMDialog()

    attemptToEditRPM('some explanation')

    cy.wait('@rpmDiagnosisPutRequest').should((xhr) => {
      expect(xhr.request.body.id).to.equal('1')
      expect(xhr.request.body.primary).to.equal('edited primary diagnosis')
      expect(xhr.request.body.secondary).to.equal('edited secondary diagnosis')
      expect(xhr.request.body.note).to.equal('some explanation')
    })

    cy.get('mat-dialog-container')
      .find('button')
      .contains('Edit Diagnosis')
      .parent()
      .should('have.attr', 'disabled')
  })

  it('Prevents users from editing the RPM entry if more than 24 hours passed and there is already an edition to the field', function () {
    standardSetup(undefined, [
      {
        url: '/1.0/rpm/state**',
        fixture: '/api/rpm/rpmStateEnabledEntries'
      },
      {
        url: '1.0/rpm/state/1/diagnosis/audit?**',
        fixture: '/api/rpm/rpmDiagnosisAuditEntries'
      }
    ])

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

    cy.get('.ccr-dashboard', { timeout: 12000 })

    openRPMDialog()

    cy.get('mat-dialog-container')
      .find('button')
      .contains('Edit Diagnosis')
      .parent()
      .should('have.attr', 'disabled')
  })
})
