import { standardSetup } from '../../../support'

const checkToggle = (dataCy: string, checked: boolean) => {
  cy.get(`[data-cy="${dataCy}"]`)
    .find('.mat-slide-toggle-input')
    .should(checked ? 'be.checked' : 'not.be.checked')
}

describe('Coach Settings Page', () => {
  beforeEach(() => {
    cy.setTimezone('et')
    standardSetup(true)

    cy.visit('/admin/accounts/coaches')
    cy.get('ccr-accounts-table', { timeout: 10000 })
    cy.get('button.mat-icon-button', { timeout: 10000 }).eq(0).click()
    cy.tick(10000)

    cy.get('div.ccr-tabs').find('a').as('coachSettingTabs')
  })

  it('All coach setting tabs exist', () => {
    cy.get('@coachSettingTabs').should('have.length', 5)
    cy.get('@coachSettingTabs').eq(0).contains('Profile')
    cy.get('@coachSettingTabs').eq(1).contains('Associations')
    cy.get('@coachSettingTabs').eq(2).contains('Care Management')
    cy.get('@coachSettingTabs').eq(3).contains('External Identifiers')
    cy.get('@coachSettingTabs').eq(4).contains('Email Log')
  })

  describe('Care Management', () => {
    it('should enable all settings with no preference', () => {
      cy.intercept(
        'GET',
        '1.0/care-management/service-type/account?account=**',
        {
          fixture: 'api/general/emptyDataEmptyPagination'
        }
      )

      cy.get('@coachSettingTabs').eq(2).click()

      const careTags = {
        rpm: true,
        ccm: true,
        rtm: true,
        pcm: true,
        bhi: true
      }

      for (const tag of Object.keys(careTags)) {
        checkToggle(`coach-care-pref-option-${tag}`, careTags[tag])
      }
    })

    it('should mixed enable/disable with preferences', () => {
      cy.get('@coachSettingTabs').eq(2).click()

      const careTags = {
        rpm: true,
        ccm: false,
        rtm: true,
        pcm: true,
        bhi: true
      }

      for (const tag of Object.keys(careTags)) {
        checkToggle(`coach-care-pref-option-${tag}`, careTags[tag])
      }
    })

    it('should create disabled preference', () => {
      cy.get('@coachSettingTabs').eq(2).click()

      cy.get('[data-cy="coach-care-pref-option-pcm"]')
        .find('.mat-slide-toggle-input')
        .click({ force: true })

      cy.wait('@createCoachCarePreference').should((xhr) => {
        expect(xhr.response.statusCode).to.equal(200)
        expect(xhr.request.body.serviceType).to.equal('4')
        expect(xhr.request.body.status).to.equal('inactive')
      })
    })

    it('should enable preference', () => {
      checkEnableDisablePreference('coach-care-pref-option-ccm', true)
    })

    it('should disable preference', () => {
      checkEnableDisablePreference('coach-care-pref-option-rpm', false)
    })
  })
})

const checkEnableDisablePreference = (dataCy: string, enable: boolean) => {
  cy.get('@coachSettingTabs').eq(2).click()

  cy.get(`[data-cy="${dataCy}"]`)
    .find('.mat-slide-toggle-input')
    .click({ force: true })

  cy.wait('@updateCoachCarePreference').should((xhr) => {
    expect(xhr.response.statusCode).to.equal(200)
    expect(xhr.request.body.status).to.equal(enable ? 'active' : 'inactive')
  })
}
