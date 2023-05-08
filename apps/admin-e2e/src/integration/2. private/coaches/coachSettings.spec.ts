import { standardSetup } from '../../../support'

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

      cy.get('[data-cy="coach-care-pref-option-rpm"]')
        .find('.mat-slide-toggle-input')
        .should('be.checked')

      cy.get('[data-cy="coach-care-pref-option-ccm"]')
        .find('.mat-slide-toggle-input')
        .should('be.checked')

      cy.get('[data-cy="coach-care-pref-option-rtm"]')
        .find('.mat-slide-toggle-input')
        .should('be.checked')

      cy.get('[data-cy="coach-care-pref-option-pcm"]')
        .find('.mat-slide-toggle-input')
        .should('be.checked')

      cy.get('[data-cy="coach-care-pref-option-bhi"]')
        .find('.mat-slide-toggle-input')
        .should('be.checked')
    })

    it('should mixed enable/disable with preferences', () => {
      cy.get('@coachSettingTabs').eq(2).click()

      cy.get('[data-cy="coach-care-pref-option-rpm"]')
        .find('.mat-slide-toggle-input')
        .should('be.checked')

      cy.get('[data-cy="coach-care-pref-option-ccm"]')
        .find('.mat-slide-toggle-input')
        .should('not.be.checked')

      cy.get('[data-cy="coach-care-pref-option-rtm"]')
        .find('.mat-slide-toggle-input')
        .should('be.checked')

      cy.get('[data-cy="coach-care-pref-option-pcm"]')
        .find('.mat-slide-toggle-input')
        .should('be.checked')

      cy.get('[data-cy="coach-care-pref-option-bhi"]')
        .find('.mat-slide-toggle-input')
        .should('be.checked')
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

        cy.get('[data-cy="coach-care-pref-option-pcm"]')
          .find('.mat-slide-toggle-input')
          .should('not.be.checked')
      })
    })

    it('should enable preference', () => {
      cy.get('@coachSettingTabs').eq(2).click()

      cy.get('[data-cy="coach-care-pref-option-ccm"]')
        .find('.mat-slide-toggle-input')
        .click({ force: true })

      cy.wait('@updateCoachCarePreference').should((xhr) => {
        expect(xhr.response.statusCode).to.equal(200)
        expect(xhr.request.body.status).to.equal('active')

        cy.get('[data-cy="coach-care-pref-option-ccm"]')
          .find('.mat-slide-toggle-input')
          .should('be.checked')
      })
    })

    it('should disable preference', () => {
      cy.get('@coachSettingTabs').eq(2).click()

      cy.get('[data-cy="coach-care-pref-option-rpm"]')
        .find('.mat-slide-toggle-input')
        .click({ force: true })

      cy.wait('@updateCoachCarePreference').should((xhr) => {
        expect(xhr.response.statusCode).to.equal(200)
        expect(xhr.request.body.status).to.equal('inactive')

        cy.get('[data-cy="coach-care-pref-option-rpm"]')
          .find('.mat-slide-toggle-input')
          .should('not.be.checked')
      })
    })
  })
})
