import { standardSetup } from '../../../../support'
import {
  addTime,
  expectCorrectTimeTrackingRequest,
  expectToastNotification,
  selectMinutesAndSeconds,
  setAutomatedTimeTrackingPreference,
  shouldIncludeRpmTag,
  shouldNotIncludeRpmTag
} from './utils'

const STORAGE_ACTIVE_CARE_MANAGEMENT_SERVICE_TYPE =
  'ccrActiveCareManagementServiceType'

describe('Patient profile -> dashboard -> rpm', function () {
  beforeEach(() => {
    cy.setOrganization('chap')
    window.localStorage.setItem(
      STORAGE_ACTIVE_CARE_MANAGEMENT_SERVICE_TYPE,
      '1'
    )

    standardSetup({
      apiOverrides: [
        {
          url: '/1.0/warehouse/care-management/billing/snapshot**',
          fixture: `api/warehouse/getRPMBillingSnapshot`
        },
        {
          url: '/1.0/care-management/state?**',
          fixture: `api/care-management/getAllCareStates`
        }
      ]
    })
    cy.fixture('api/organization/getSingle').then((organization) => {
      organization.id = Cypress.env('organizationId')
      organization.name = 'CHAP - Test'
      organization.hierarchyPath = [Cypress.env('organizationId'), '1']
      cy.intercept(
        'GET',
        `/2.0/organization/${Cypress.env('organizationId')}`,
        organization
      )
    })
  })
  describe('manual timeTracking', () => {
    it('service type should not be included on account activity post request', () => {
      cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

      setAutomatedTimeTrackingPreference('disabled')
      cy.wait('@accountActivityPostRequest')

      cy.get('[data-cy="manual-time-enabled-notice"]')
        .should('contain', 'Automatic time tracking paused for this clinic')
        .should('be.exist')

      cy.get('.ccr-tabs').find('a').eq(1).click()

      cy.wait('@accountActivityPostRequest')
      shouldNotIncludeRpmTag()
    })

    it('service type should be included on account activity post request', () => {
      cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)
      setAutomatedTimeTrackingPreference('enabled')

      cy.get('app-sidenav-org-selector')
        .click()
        .get('[role="menuitem"]')
        .eq(0)
        .click()

      cy.get('app-footer').should('contain', 'CoachCare')

      cy.tick(10000)

      cy.get('[data-cy="manual-time-enabled-notice"]').should('not.be.exist')

      cy.tick(10000)
      cy.get('.ccr-tabs').find('a').eq(0).click()

      cy.wait('@accountActivityPostRequest')
      cy.wait('@accountActivityPostRequest')
      cy.wait('@accountActivityPostRequest')
      shouldIncludeRpmTag()
    })

    it('should be able to add manual time tracking', () => {
      cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

      setAutomatedTimeTrackingPreference('disabled')
      cy.tick(10000)

      selectMinutesAndSeconds(1, 30)

      addTime()

      cy.wait('@accountActivityPostRequest').wait('@accountActivityPostRequest')

      expectCorrectTimeTrackingRequest(
        Cypress.env('organizationId'),
        '2019-12-31T23:58:50.000Z',
        '2020-01-01T00:00:20.000Z'
      )

      expectToastNotification('Manual time tracking added')

      selectMinutesAndSeconds(0, 30)

      addTime()

      expectCorrectTimeTrackingRequest(
        Cypress.env('organizationId'),
        '2020-01-01T00:00:00.000Z',
        '2020-01-01T00:00:30.000Z'
      )

      selectMinutesAndSeconds(55, 30)

      addTime()

      expectCorrectTimeTrackingRequest(
        Cypress.env('organizationId'),
        '2019-12-31T23:05:10.000Z',
        '2020-01-01T00:00:40.000Z'
      )
    })

    it('should handle error when adding manual time tracking', () => {
      cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

      cy.tick(10000)

      selectMinutesAndSeconds(1, 30)

      cy.intercept('POST', '/1.0/account/activity/event', {
        statusCode: 400,
        body: {}
      })

      addTime()

      expectToastNotification('Error adding manual time tracking')
    })

    it('should reset form after close panel', () => {
      cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

      cy.tick(10000)

      selectMinutesAndSeconds(1, 30)

      cy.get('[data-cy="open-status-button"]').click().click()
      cy.tick(10000)

      addTime()

      cy.get('mat-select[formControlName=minutes]')
        .find('.mat-select-value-text')
        .should('contain', '0')
      cy.get('mat-select[formControlName=seconds]')
        .find('.mat-select-value-text')
        .should('contain', '0')
    })

    it('should handle change of service type that has disabled manual time tracking', () => {
      cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

      cy.tick(10000)

      cy.get('[data-cy="manual-time-enabled-notice"]').should('not.be.exist')

      cy.wait('@accountActivityPostRequest')

      cy.get('mat-select[formcontrolname=serviceType]')
        .click()
        .get('mat-option')
        .contains('CCM')
        .click()

      cy.get('mat-select[formControlName=serviceType]')

      cy.get('[data-cy="manual-time-enabled-notice"]').should(
        'contain',
        'Automatic time tracking paused for this clinic'
      )
    })
  })
})
