import { standardSetup } from '../../../support'

enum Sections {
  core = 'core',
  visual = 'visual',
  mala = 'mala',
  features = 'features',
  security = 'security'
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
      expect(xhr.status).to.equal(204)
      expect(xhr.request.body.id).to.equal(Cypress.env('organizationId'))
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

    cy.get('[data-cy="org-setting-mala-appname"]')
      .invoke('val')
      .should('contain', 'CoachCare')
    cy.get('[data-cy="org-setting-mala-iosbundleid"]')
      .invoke('val')
      .should('contain', 'com.coachcare.coachcareionic')
    cy.get('[data-cy="org-setting-mala-androidbundleid"]')
      .invoke('val')
      .should('contain', 'com.coachcare.coachcareionic.android')
    cy.get('[data-cy="org-setting-mala-firebaseprojectname"]')
      .invoke('val')
      .should('contain', 'production')
    cy.get('[data-cy="org-setting-mala-appstoreconnectteamid"]')
      .invoke('val')
      .should('contain', '1239712973')
    cy.get('[data-cy="org-setting-mala-developerportalteamid"]')
      .invoke('val')
      .should('contain', 'wfe9h023ry')

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

  it('Features section data display appropriately', () => {
    cy.get(`[data-cy="org-settings-menu-features"]`).click()

    cy.get('[data-cy="org-settings-section-features-video"]')
      .find('.mat-select')
      .should('contain', 'Enabled')

    cy.get('[data-cy="org-settings-section-features-library"]')
      .find('.mat-slide-toggle-input')
      .should('be.checked')

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
      .find('.mat-slide-toggle-input')
      .should('be.checked')

    cy.get('[data-cy="org-settings-section-features-rpm"]')
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
        // tslint:disable-next-line:no-unused-expression
        expect($el).not.to.be.checked
      })
  })

  it('MALA ios app id updates properly', () => {
    cy.get(`[data-cy="org-settings-menu-mala"]`).click()
    cy.get('[data-cy="org-setting-appid-ios"]').as('iOSInput')

    cy.get('@iOSInput').clear().type('ios-app-new-value').blur()

    cy.wait('@updateMalaCall').should((xhr) => {
      expect(xhr.status).to.equal(204)
      expect(xhr.request.body.appIds.ios).to.equal('ios-app-new-value')
      expect(xhr.request.body.appIds.android).to.equal('android-app')
    })
  })

  it('MALA android app id updates properly', () => {
    cy.get(`[data-cy="org-settings-menu-mala"]`).click()
    cy.get('[data-cy="org-setting-appid-android"]').as('androidInput')

    cy.get('@androidInput').clear().type('android-app-new-value').blur()

    cy.wait('@updateMalaCall').should((xhr) => {
      expect(xhr.status).to.equal(204)
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
      expect(xhr.status).to.equal(204)
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
      expect(xhr.status).to.equal(204)
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
