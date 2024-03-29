import { standardSetup } from '../../../support'
import {
  verifyActiveOption,
  verifyDeviceSetupNotification,
  verifyAutomaticTimeTracking,
  selectActiveOption,
  verifyBillingType,
  verifyMonitoringType
} from './utils'

enum Sections {
  core = 'core',
  visual = 'visual',
  mala = 'mala',
  features = 'features',
  security = 'security',
  care = 'care'
}

interface Subsection {
  section: Sections
  selector: string
}

const subSections: Array<Subsection> = [
  {
    section: Sections.core,
    selector: 'org-settings-section-basic'
  },
  {
    section: Sections.core,
    selector: 'org-settings-section-bcc'
  },
  {
    section: Sections.visual,
    selector: 'org-settings-section-colors'
  },
  {
    section: Sections.visual,
    selector: 'org-settings-section-images'
  },
  {
    section: Sections.mala,
    selector: 'org-settings-section-appids'
  },
  {
    section: Sections.mala,
    selector: 'org-settings-section-mala'
  },
  {
    section: Sections.mala,
    selector: 'org-settings-section-json'
  },
  {
    section: Sections.care,
    selector: 'org-settings-section-care'
  },
  {
    section: Sections.features,
    selector: 'org-settings-section-features'
  },
  {
    section: Sections.security,
    selector: 'org-settings-section-security'
  }
]

describe('Clinic Settings', () => {
  beforeEach(() => {
    cy.setTimezone('et')
    standardSetup(true)

    cy.visit(`/admin/organizations/${Cypress.env('organizationId')}/settings`)

    cy.tick(10000)
  })

  it('All clinic settings exist and sections display appropriately', () => {
    verifySectionVisiblity(Sections.core)
    verifySectionVisiblity(Sections.visual)
    verifySectionVisiblity(Sections.mala)
    verifySectionVisiblity(Sections.features)
    verifySectionVisiblity(Sections.security)
  })

  it('Core section data displays and updates appropriately', () => {
    cy.get(`[data-cy="org-settings-menu-core"]`).click()

    cy.get('[data-cy="org-setting-displayname"]')
      .invoke('val')
      .should('contain', 'testing')

    cy.get('[data-cy="org-setting-displayname"]')
      .focus()
      .wait(300)
      .type(' 123 and then')
      .wait(300)
      .blur()

    cy.wait('@updateOrgCall').should((xhr) => {
      expect(xhr.response.statusCode).to.equal(204)
      expect(xhr.request.body.id).to.equal(
        Cypress.env('organizationId').toString()
      )
      expect(xhr.request.body.displayName).to.equal('testing 123 and then')
    })
  })

  it('Visual section data display appropriately', () => {
    cy.get(`[data-cy="org-settings-menu-visual"]`).click()

    cy.get('[data-cy="org-setting-colors-primary"]')
      .find('input')
      .first()
      .invoke('val')
      .should('contain', '165bbf')
    cy.get('[data-cy="org-setting-colors-secondary"]')
      .find('input')
      .first()
      .invoke('val')
      .should('contain', 'ff0000')
    cy.get('[data-cy="org-setting-colors-accent"]')
      .find('input')
      .first()
      .invoke('val')
      .should('contain', '#555555')
    cy.get('[data-cy="org-setting-colors-toolbar"]').should('contain', 'Accent')
  })

  it('MALA section data display appropriately', () => {
    cy.get(`[data-cy="org-settings-menu-mala"]`).click()

    cy.get('[data-cy="org-setting-appid-ios"]')
      .invoke('val')
      .should('contain', 'ios-app')
    cy.get('[data-cy="org-setting-appid-android"]')
      .invoke('val')
      .should('contain', 'android-app')

    const malaConfigs = {
      appname: 'CoachCare',
      iosbundleid: 'com.coachcare.coachcareionic',
      androidbundleid: 'com.coachcare.coachcareionic.android',
      firebaseprojectname: 'production',
      appstoreconnectteamid: '1239712973',
      developerportalteamid: 'wfe9h023ry'
    }

    for (const config of Object.keys(malaConfigs)) {
      cy.get(`[data-cy="org-setting-mala-${config}"]`)
        .invoke('val')
        .should('contain', malaConfigs[config])
    }

    cy.get('ccr-form-field-translated-text')
      .find('input[type="text"]')
      .eq(0)
      .invoke('val')
      .should('contain', 'English')

    cy.get('ccr-form-field-translated-text')
      .find('textarea')
      .eq(0)
      .invoke('val')
      .should('contain', 'Test text english')

    cy.get('ccr-form-field-translated-text')
      .find('input[type="text"]')
      .eq(1)
      .invoke('val')
      .should('contain', 'Español')

    cy.get('ccr-form-field-translated-text')
      .find('textarea')
      .eq(1)
      .invoke('val')
      .should('contain', 'Test text spanish')

    cy.get('[data-cy="org-setting-jsoneditor"]')
      .find('.jsoneditor-values')
      .should('contain', 'other1')
      .parent()
      .parent()
      .should('contain', 'other text')
    cy.get('[data-cy="org-setting-jsoneditor"]')
      .find('.jsoneditor-values')
      .should('contain', 'other2')
      .parent()
      .parent()
      .should('contain', 'other text 2')
    cy.get('[data-cy="org-setting-jsoneditor"]')
      .find('.jsoneditor-values')
      .should('contain', 'otherempty')
      .parent()
      .parent()
      .find('.jsoneditor-empty')
      .should('have.length', 1)
    cy.get('[data-cy="org-setting-jsoneditor"]')
      .find('.jsoneditor-values')
      .should('contain', 'othernull')
      .parent()
      .parent()
      .should('contain', 'null')
  })

  it('Care Management section data display appropriately', () => {
    cy.get(`[data-cy="org-settings-menu-care"]`).click()

    // RPM enabled and deviceSetupNotification enabled and automaticTimeTracking enabled
    verifyActiveOption('rpm', 'Enabled')
    verifyDeviceSetupNotification('rpm', 'be.checked')
    verifyAutomaticTimeTracking('rpm', 'Enabled')
    verifyBillingType('rpm', 'contain', 'Self Service')
    verifyMonitoringType('rpm', 'contain', 'Self Service')

    // CCM enabled and deviceSetupNotification disabled
    verifyActiveOption('ccm', 'Enabled')
    verifyDeviceSetupNotification('ccm', 'not.be.checked')
    verifyAutomaticTimeTracking('ccm', 'Disabled')
    verifyBillingType('ccm', 'contain', 'Self Service')
    verifyMonitoringType('ccm', 'contain', 'Self Service')

    // RTM disabled
    verifyActiveOption('rtm', 'Disabled')
    verifyDeviceSetupNotification('rtm', 'not.be.visible')
    verifyBillingType('rtm', 'not.be.visible')
    verifyMonitoringType('rtm', 'not.be.visible')

    // PCM inherit from parent org
    verifyActiveOption('pcm', 'Inherit')
    verifyDeviceSetupNotification('pcm', 'be.disabled')
    verifyBillingType('pcm', 'contain', 'Self Service')
    verifyMonitoringType('pcm', 'contain', 'Self Service')
    verifyBillingType('pcm', 'have.attr', 'aria-disabled')
    verifyMonitoringType('pcm', 'have.attr', 'aria-disabled')

    // BHI no preference (Inherit)
    verifyActiveOption('bhi', 'Inherit')
    verifyDeviceSetupNotification('bhi', 'not.be.visible')
    verifyBillingType('bhi', 'not.be.visible')
    verifyMonitoringType('bhi', 'not.be.visible')
  })

  it('Care Management update preferences', () => {
    cy.get(`[data-cy="org-settings-menu-care"]`).click()

    // Create care preference
    selectActiveOption('bhi', 'Enabled')

    cy.wait('@createOrgCarePreference').should((xhr) => {
      expect(xhr.response.statusCode).to.equal(200)
      expect(xhr.request.body.isActive).to.equal(true)
      expect(xhr.request.body.deviceSetupNotification).to.equal('enabled')
      expect(xhr.request.body.billing).to.equal('self-service')
      expect(xhr.request.body.monitoring).to.equal('self-service')
    })

    // Disable care preference
    selectActiveOption('rpm', 'Disabled')

    cy.wait('@updateOrgCarePreference').should((xhr) => {
      expect(xhr.response.statusCode).to.equal(204)
      expect(xhr.request.body.isActive).to.equal(false)
      expect(xhr.request.body.deviceSetupNotification).to.equal('enabled')
      expect(xhr.request.body.billing).to.equal('self-service')
      expect(xhr.request.body.monitoring).to.equal('self-service')
    })

    // Inherit care preference
    selectActiveOption('rpm', 'Inherit')

    cy.wait('@deleteOrgCarePreference').should((xhr) => {
      expect(xhr.response.statusCode).to.equal(204)
    })

    // Enable device setup notification
    cy.get('[data-cy="org-settings-section-care-ccm"]')
      .find('[data-cy="care-preference-device-setup-notification"]')
      .find('.mat-slide-toggle-input')
      .click({ force: true })

    cy.tick(10000)

    cy.wait('@updateOrgCarePreference').should((xhr) => {
      expect(xhr.response.statusCode).to.equal(204)
      expect(xhr.request.body.isActive).to.equal(true)
      expect(xhr.request.body.deviceSetupNotification).to.equal('enabled')
    })

    // Disable device setup notification
    cy.get('[data-cy="org-settings-section-care-rpm"]')
      .find('[data-cy="care-preference-device-setup-notification"]')
      .find('.mat-slide-toggle-input')
      .click({ force: true })

    cy.tick(10000)

    cy.wait('@updateOrgCarePreference').should((xhr) => {
      expect(xhr.response.statusCode).to.equal(204)
      expect(xhr.request.body.isActive).to.equal(true)
      expect(xhr.request.body.deviceSetupNotification).to.equal('disabled')
    })
  })

  it('should update automatic time tracking preference', () => {
    updatingCarePreference(
      'care-preference-automated-time-tracking-option',
      'Disabled',
      'automatedTimeTracking',
      'disabled'
    )
  })

  it('should update billing type preference', () => {
    updatingCarePreference(
      'care-preference-billing-option',
      'Managed',
      'billing',
      'managed'
    )
  })

  it('should update monitoring type preference', () => {
    updatingCarePreference(
      'care-preference-monitoring-option',
      'Managed',
      'monitoring',
      'managed'
    )
  })

  it('Features section data display appropriately', () => {
    cy.get(`[data-cy="org-settings-menu-features"]`).click()

    cy.get('[data-cy="org-settings-section-features-video"]')
      .find('.mat-select')
      .should('contain', 'Enabled')

    cy.get('[data-cy="org-settings-section-features-library"]')
      .find('.mat-select')
      .should('contain', 'Enabled')

    cy.get('[data-cy="org-settings-section-features-messaging"]')
      .find('.mat-select')
      .should('contain', 'Disabled')

    cy.get('[data-cy="org-settings-section-features-autothread"]')
      .find('.mat-slide-toggle-input')
      .should('not.be.checked')

    cy.get('[data-cy="org-settings-section-features-openClient"]')
      .find('.mat-select')
      .should('contain', 'Enabled')

    cy.get('[data-cy="org-settings-section-features-patientAutoDisassociate"]')
      .find('.mat-slide-toggle-input')
      .should('not.be.checked')

    cy.get('[data-cy="org-settings-section-features-sequences"]')
      .find('.mat-select')
      .should('contain', 'Enabled')

    cy.get('[data-cy="org-settings-section-features-filevault"]')
      .find('.mat-select')
      .should('contain', 'Enabled')

    cy.get('[data-cy="org-settings-section-features-autoenroll"]')
      .find('.mat-slide-toggle-input')
      .should('be.checked')
  })

  it('Security section data display appropriately', () => {
    cy.get(`[data-cy="org-settings-menu-security"]`).click()

    cy.get('[data-cy="org-settings-section-security"]')
      .find('.mat-slide-toggle-input')
      .should('be.checked')

    cy.get('[data-cy="org-settings-section-security"]')
      .find('.mat-checkbox-input')
      .should('have.length', 4)
      .each(($el) => {
        // eslint-disable-next-line no-unused-expressions, @typescript-eslint/no-unused-expressions
        expect($el).not.to.be.checked
      })
  })

  it('MALA ios app id updates properly', () => {
    cy.get(`[data-cy="org-settings-menu-mala"]`).click()
    cy.get('[data-cy="org-setting-appid-ios"]').as('iOSInput')

    cy.get('@iOSInput').clear().type('ios-app-new-value').blur()

    cy.wait('@updateMalaCall').should((xhr) => {
      expect(xhr.response.statusCode).to.equal(204)
      expect(xhr.request.body.appIds.ios).to.equal('ios-app-new-value')
      expect(xhr.request.body.appIds.android).to.equal('android-app')
    })
  })

  it('MALA android app id updates properly', () => {
    cy.get(`[data-cy="org-settings-menu-mala"]`).click()
    cy.get('[data-cy="org-setting-appid-android"]').as('androidInput')

    cy.get('@androidInput').clear().type('android-app-new-value').blur()

    cy.wait('@updateMalaCall').should((xhr) => {
      expect(xhr.response.statusCode).to.equal(204)
      expect(xhr.request.body.appIds.ios).to.equal('ios-app')
      expect(xhr.request.body.appIds.android).to.equal('android-app-new-value')
    })
  })

  it('MALA app id section respects overlapping data', () => {
    cy.wait(2000)
    cy.tick(10000)

    cy.get(`[data-cy="org-settings-menu-mala"]`).click()

    cy.get('[data-cy="org-setting-jsoneditor"]')
      .find('.jsoneditor-field')
      .eq(0)
      .trigger('click')
      .clear()
      .type('other1')

    cy.tick(10000)

    cy.wait('@updateMalaCall').should((xhr) => {
      expect(xhr.request.body.mala.appName).to.equal('CoachCare')
      expect(xhr.request.body.mala.iosBundleId).to.equal(
        'com.coachcare.coachcareionic'
      )
      expect(xhr.request.body.mala.androidBundleId).to.equal(
        'com.coachcare.coachcareionic.android'
      )
      expect(xhr.request.body.mala.firebaseProjectName).to.equal('production')
      expect(xhr.request.body.mala.developerPortalTeamId).to.equal('wfe9h023ry')
      expect(xhr.request.body.mala.appStoreConnectTeamId).to.equal('1239712973')
      expect(xhr.request.body.mala.other.other1).to.equal('other text')
      expect(xhr.response.statusCode).to.equal(204)
    })

    cy.get('[data-cy="org-setting-jsoneditor"]')
      .find('.jsoneditor-value.jsoneditor-string')
      .eq(0)
      .trigger('click')
      .clear()
      .type('newjsoneditorvalue')

    cy.tick(10000)

    cy.wait('@updateMalaCall').should((xhr) => {
      expect(xhr.request.body.mala.appName).to.equal('CoachCare')
      expect(xhr.request.body.mala.iosBundleId).to.equal(
        'com.coachcare.coachcareionic'
      )
      expect(xhr.request.body.mala.androidBundleId).to.equal(
        'com.coachcare.coachcareionic.android'
      )
      expect(xhr.request.body.mala.firebaseProjectName).to.equal('production')
      expect(xhr.request.body.mala.developerPortalTeamId).to.equal('wfe9h023ry')
      expect(xhr.request.body.mala.appStoreConnectTeamId).to.equal('1239712973')
      expect(xhr.request.body.mala.other.other1).to.equal('newjsoneditorvalue')
      expect(xhr.response.statusCode).to.equal(204)
    })
  })
})

function verifySectionVisiblity(section: Sections): void {
  cy.get(`[data-cy="org-settings-menu-${section}"]`).click()

  for (const s of Object.keys(Sections)) {
    cy.get(`[data-cy="org-settings-menu-${s}"]`).should(
      section === s ? 'have.class' : 'not.have.class',
      'selected'
    )
  }

  for (const s of subSections) {
    cy.get(`[data-cy="${s.selector}"]`)
      .scrollIntoView()
      .should(section === s.section ? 'be.visible' : 'not.be.visible')
  }
}

function updatingCarePreference(
  selector: string,
  option: string,
  property: string,
  value: string
) {
  cy.get(`[data-cy="org-settings-menu-care"]`).click()
  cy.get('[data-cy="org-settings-section-care-rpm"]')
    .find(`[data-cy="${selector}"]`)
    .find('.mat-select')
    .eq(0)
    .trigger('click')
    .wait(500)
  cy.get('.mat-select-panel')
    .find('mat-option')
    .contains(option)
    .trigger('click')
    .trigger('blur', { force: true })
    .wait(500)
  cy.tick(1000)
  cy.wait('@updateOrgCarePreference').should((xhr) => {
    expect(xhr.response.statusCode).to.equal(204)
    expect(xhr.request.body.isActive).to.equal(true)
    expect(xhr.request.body[property]).to.equal(value)
  })
}
