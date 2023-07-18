import { Interception } from 'cypress/types/net-stubbing'
import { standardSetup } from '../../../../../support'
import { ApiOverrideEntry } from '../../../../../support/api'
const STORAGE_ACTIVE_CARE_MANAGEMENT_SERVICE_TYPE =
  'ccrActiveCareManagementServiceType'

const serviceTypeList = [
  {
    serviceType: {
      id: '1',
      name: 'RPM',
      tag: 'rpm'
    },
    billingCodes: ['99453', '99454', '99457', '99458 (1)', '99458 (2)']
  },
  {
    serviceType: {
      id: '2',
      name: 'CCM',
      tag: 'ccm'
    },
    billingCodes: ['99490', '99439 (1)', '99439 (2)']
  },
  {
    serviceType: {
      id: '3',
      name: 'RTM',
      tag: 'rtm'
    },
    billingCodes: ['98975', '98977', '98980', '98981 (1)', '98981 (2)']
  },
  {
    serviceType: {
      id: '4',
      name: 'PCM',
      tag: 'pcm'
    },
    billingCodes: ['99426', '99427 (1)', '99427 (2)']
  },
  {
    serviceType: {
      id: '5',
      name: 'BHI',
      tag: 'bhi'
    },
    billingCodes: ['99484']
  }
]

const activeRPMSessionDate = 'June 8, 2023'
const activeCCMSessionDate = 'May 16, 2023'
const passedRPMSession = {
  serviceType: 'RPM',
  startDate: '06/03/2023',
  endDate: '06/05/2023',
  disabledBy: 'Zhang Xin'
}
const passedCCMSession = {
  serviceType: 'CCM',
  startDate: '05/07/2023',
  endDate: '05/10/2023',
  disabledBy: 'Zhang Xin'
}

const testCurrentCTPCode = ({
  snapshot,
  code,
  isCompleted
}: {
  snapshot: string
  code: string | null
  isCompleted?: boolean
}) => {
  window.localStorage.setItem(STORAGE_ACTIVE_CARE_MANAGEMENT_SERVICE_TYPE, '1')

  standardSetup({
    apiOverrides: [
      {
        url: '/1.0/warehouse/care-management/billing/snapshot**',
        fixture: `api/warehouse/${snapshot}`
      },
      {
        url: '/1.0/care-management/state?**',
        fixture: `api/care-management/getAllCareStates`
      }
    ]
  })

  cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

  cy.get('.ccr-dashboard')
  cy.get('[data-cy="care-management-state"]')
    .find('mat-select')
    .should('contain', 'RPM')

  cy.wait('@careManagementStates')
  cy.tick(1000)
  cy.wait(1000)

  if (isCompleted || code === null) {
    cy.get('[data-cy="care-management-state"]')
      .find('.current-code')
      .should('not.exist')

    if (isCompleted) {
      cy.get('[data-cy="care-management-state"]')
        .find('.rpm-status-completed-icon')
        .should('exist')
    }

    cy.get('[data-cy="care-management-state"]')
      .find('.timer')
      .should('contain', '00:00 / 00:00')
  } else {
    cy.get('[data-cy="care-management-state"]')
      .find('.current-code')
      .should('contain', code)

    cy.get('[data-cy="care-management-state"]')
      .find('.timer')
      .should('contain', '00:00 / 20:00')
  }
}

describe('Patient profile -> dashboard -> rpm', function () {
  beforeEach(() => {
    cy.setOrganization('mdteam')
  })

  describe('visibility', () => {
    it('should show care management state', () => {
      checkVisibility(true)
    })

    it('should not show with authenticated provider has no active service types enabled', () => {
      checkVisibility(false, [
        {
          url: '/1.0/care-management/service-type/account?**',
          fixture: 'api/care-management/getInActiveServiceTypeAccount'
        }
      ])
    })

    it('should not show with currently-selected clinic context has no active service types', () => {
      checkVisibility(false, [
        {
          url: '/1.0/care-management/preference/organization?**',
          fixture: 'api/care-management/getInActivePreferenceOrganization'
        }
      ])
    })

    it('should not show with the authenticated provider has some active service types enabled that do not overlap/are shared by the currently-select clinic context', () => {
      checkVisibility(false, [
        {
          url: '/1.0/care-management/preference/organization?**',
          fixture: 'api/general/emptyDataEmptyPagination'
        }
      ])
    })
  })

  describe('selection', () => {
    it('should select first one by default and set session', () => {
      localStorage.removeItem(STORAGE_ACTIVE_CARE_MANAGEMENT_SERVICE_TYPE)
      checkServiceSelection({ id: '1', name: 'RPM' })
    })

    it('should select first one by default if the session exists but not available', () => {
      window.localStorage.setItem(
        STORAGE_ACTIVE_CARE_MANAGEMENT_SERVICE_TYPE,
        '5'
      )
      checkServiceSelection({ id: '1', name: 'RPM' })
    })

    it('should select with available session', () => {
      window.localStorage.setItem(
        STORAGE_ACTIVE_CARE_MANAGEMENT_SERVICE_TYPE,
        '2'
      )

      checkServiceSelection({ id: '2', name: 'CCM' })
    })

    it('should show no program', () => {
      checkServiceSelection()
    })
  })

  describe('timeTracking', () => {
    it('should set select care service type in event', () => {
      window.localStorage.setItem(
        STORAGE_ACTIVE_CARE_MANAGEMENT_SERVICE_TYPE,
        '1'
      )

      standardSetup({
        apiOverrides: [
          {
            url: '/1.0/warehouse/care-management/billing/snapshot**',
            fixture: `api/warehouse/getRPMBillingSnapshot`
          }
        ]
      })

      cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

      cy.get('.ccr-dashboard')
      cy.get('[data-cy="care-management-state"]')
        .find('mat-select')
        .should('contain', 'RPM')

      cy.get('.ccr-tabs').find('a').eq(1).click()

      cy.tick(10000)

      cy.wait('@accountActivityPostRequest')
      cy.wait('@accountActivityPostRequest')
      cy.wait('@accountActivityPostRequest').should((xhr) => {
        expect(xhr.response.statusCode).to.equal(201)
        expect(xhr.request.body.tags.includes('rpm')).to.equal(false)
      })
    })

    it('should send previous code when switching service type', () => {
      window.localStorage.setItem(
        STORAGE_ACTIVE_CARE_MANAGEMENT_SERVICE_TYPE,
        '1'
      )

      standardSetup({
        apiOverrides: [
          {
            url: '/1.0/warehouse/care-management/billing/snapshot**',
            fixture: `api/warehouse/getCCMBillingSnapshot`
          }
        ]
      })

      cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

      cy.get('.ccr-dashboard')
      cy.get('[data-cy="care-management-state"]')
        .find('mat-select')
        .should('contain', 'RPM')

      cy.tick(10000)

      cy.get('.ccr-dashboard')
      cy.get('[data-cy="care-management-state"]')
        .find('mat-select')
        .eq(0)
        .trigger('click')
        .wait(500)

      cy.get('.mat-select-panel')
        .find('mat-option')
        .contains('CCM')
        .trigger('click')
        .trigger('blur', { force: true })
        .wait(500)

      cy.tick(10000)

      cy.wait('@accountActivityPostRequest')
      cy.wait('@accountActivityPostRequest')
      cy.wait('@accountActivityPostRequest').should((xhr) => {
        expect(xhr.response.statusCode).to.equal(201)
        expect(xhr.request.body.tags.includes('rpm')).to.equal(true)
      })

      // disabled auto time tracking
      cy.get('[data-cy="care-management-state"]')
        .find('.current-code')
        .should('not.exist')

      cy.get('[data-cy="care-management-state"]')
        .find('.timer')
        .should('contain', '00:00 / 00:00')
    })
  })

  describe('Current active CTP code', () => {
    describe('RPM', () => {
      it('should show 99457', () => {
        testCurrentCTPCode({
          snapshot: 'getRPMBillingSnapshotSingle',
          code: '99457'
        })
      })

      it('should show 99458 (1)', () => {
        testCurrentCTPCode({
          snapshot: 'getRPMBillingSnapshotSingleComplete99457',
          code: '99458 (1)'
        })
      })

      it('should show 99458 (2)', () => {
        testCurrentCTPCode({
          snapshot: 'getRPMBillingSnapshotSingleComplete99458-1',
          code: '99458 (2)'
        })
      })

      it('should show as completed', () => {
        testCurrentCTPCode({
          snapshot: 'getRPMBillingSnapshotSingleComplete99458-2',
          code: 'completed',
          isCompleted: true
        })
      })

      it('should show as 00:00 with no billing', () => {
        testCurrentCTPCode({
          snapshot: 'getRPMBillingSnapshotSingleNoBilling',
          code: null
        })
      })
    })

    describe('Time tracking paused modal', () => {
      it('should display and send correct event data', () => {
        window.localStorage.setItem(
          STORAGE_ACTIVE_CARE_MANAGEMENT_SERVICE_TYPE,
          '1'
        )

        standardSetup()

        cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

        cy.get('app-rpm-tracker').click()

        cy.tick(300300) // 5 minutes

        cy.get('ccr-gesture-closing-dialog')
          .should('contain', 'Time Tracking Paused')
          .click()

        cy.tick(10000)

        cy.get('[data-cy="account-search-box"]')
          .eq(1)
          .type('eric')
          .tick(10000)
          .wait(500)

        cy.get('[data-cy="account-search-box"]').eq(1).focus()

        cy.fixture('api/account/getSinglePatient').then((data) => {
          data.id = 5
          data.firstName = 'Alex'
          data.lastName = 'Smith'
          data.accountType.id = 5
          data.email = 'eric.dibari2@gmail.com'

          cy.intercept('GET', `/2.0/account/**`, {
            body: data
          })
        })

        cy.get('@accountActivityPostRequest.all').should('have.length', 3)
        cy.get('.cdk-overlay-container').find('mat-option').eq(1).click()

        cy.get('app-rpm-tracker').click()

        cy.tick(60000)
        cy.wait([
          '@accountActivityPostRequest',
          '@accountActivityPostRequest',
          '@accountActivityPostRequest',
          '@accountActivityPostRequest'
        ])
        cy.get<Interception>('@accountActivityPostRequest.all')
          .should('have.length', 4)
          .then((xhrs) => {
            expect(xhrs[0].request.body.tags).to.include('mobile-app-warmup')
            expect(xhrs[0].request.body.account).to.equal('3')
            expect(xhrs[2].request.body.interaction.time.start).to.equal(
              '2020-01-01T00:00:00.000Z'
            )
            expect(xhrs[2].request.body.interaction.time.end).to.equal(
              '2020-01-01T00:05:00.300Z'
            )
            expect(xhrs[2].request.body.account).to.equal('3')
            expect(xhrs[3].request.body.account).to.equal('5')
            expect(xhrs[3].request.body.tags).to.include('mobile-app-warmup')
          })
      })
    })

    describe('Time tracker syncing', () => {
      it('Posts an event when a route is traversed', () => {
        standardSetup()

        cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

        cy.wait(1000)
        cy.tick(1000)

        cy.get('.ccr-tabs').find('a').eq(1).click()

        cy.wait('@accountActivityPostRequest')
        cy.wait('@accountActivityPostRequest').should((xhr) => {
          expect(xhr.response.statusCode).to.equal(201)
        })
      })

      it('Consistently post events when traversing multiple routes in the same timestamp', () => {
        standardSetup()

        cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)
        cy.wait(1000)
        cy.tick(1000)
        cy.get('.ccr-tabs').find('a').eq(1).click()
        cy.get('.ccr-tabs').find('a').eq(0).click()
        cy.tick(1000)
        cy.get('.ccr-tabs').find('a').eq(1).click()
        cy.get('.ccr-tabs').find('a').eq(0).click()
        cy.tick(1000)

        cy.wait('@accountActivityPostRequest')
        cy.wait('@accountActivityPostRequest')
        cy.wait('@accountActivityPostRequest').then((xhr) => {
          expect(xhr.request.body.interaction.time.start).to.equal(
            '2020-01-01T00:00:00.000Z'
          )
          expect(xhr.request.body.interaction.time.end).to.equal(
            '2020-01-01T00:00:01.000Z'
          )
        })
        cy.wait('@accountActivityPostRequest').then((xhr) => {
          expect(xhr.request.body.interaction.time.instant).to.equal(
            '2020-01-01T00:00:01.000Z'
          )
        })
        cy.wait('@accountActivityPostRequest').then((xhr) => {
          expect(xhr.request.body.interaction.time.start).to.equal(
            '2020-01-01T00:00:01.000Z'
          )
          expect(xhr.request.body.interaction.time.end).to.equal(
            '2020-01-01T00:00:02.000Z'
          )
        })
        cy.wait('@accountActivityPostRequest').then((xhr) => {
          expect(xhr.request.body.interaction.time.instant).to.equal(
            '2020-01-01T00:00:02.000Z'
          )
        })
      })
    })
  })

  describe('Activation modal', () => {
    it('should show care only service types that allowed in both authenticated user and selected org', () => {
      standardSetup({
        apiOverrides: [
          {
            url: '/1.0/care-management/preference/organization?**',
            fixture:
              'api/care-management/getPartialActivePreferenceOrganization'
          }
        ]
      })

      cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

      cy.get('.ccr-dashboard')
      cy.get('[data-cy="open-status-button"]').click()
      cy.get('[data-cy="program_setting_button"]').click()

      cy.get('app-dialog-care-mgmt-card').should('have.length', 2)
      cy.get('app-dialog-care-mgmt-card').eq(0).contains('RPM')
      cy.get('app-dialog-care-mgmt-card').eq(1).contains('CCM')
    })

    it('should show active sessions and not show passed sessions with only multiple service types active sessions', () => {
      checkActivePassedSessions({
        fixture: 'careManagementActive',
        activeSessionsDate: [activeRPMSessionDate, activeCCMSessionDate]
      })
    })

    it('should not show active sessions and show passed sessions with only multiple service types inactive sessions', () => {
      checkActivePassedSessions({
        fixture: 'careManagementInActive',
        passedSessions: [passedRPMSession, passedCCMSession]
      })
    })

    it('should not show active sessions and show passed sessions with only single service type inactive sessions', () => {
      checkActivePassedSessions({
        fixture: 'careManagementRPMInActive',
        passedSessions: [
          passedRPMSession,
          {
            serviceType: 'RPM',
            startDate: '06/03/2023',
            endDate: '06/03/2023',
            disabledBy: 'Zhang Xin'
          }
        ]
      })
    })

    it('should show active sessions and show passed sessions with single service type with both active/inactive sessions', () => {
      checkActivePassedSessions({
        fixture: 'careManagementRPMActive',
        activeSessionsDate: [activeRPMSessionDate],
        passedSessions: [passedRPMSession]
      })
    })

    it('should show active sessions and show passed sessions with  multiple service types active/inactive sessions', () => {
      checkActivePassedSessions({
        fixture: 'careManagementDefault',
        activeSessionsDate: [activeRPMSessionDate, activeCCMSessionDate],
        passedSessions: [passedRPMSession, passedCCMSession]
      })
    })

    it('should show disabled details', () => {
      standardSetup()

      cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

      cy.get('.ccr-dashboard')
      cy.get('[cy-data="open-status-button"]').click()
      cy.get('[cy-data="program_setting_button"]').click()

      cy.get('table').find('tbody tr').as('passedSessions')
      cy.get('@passedSessions').eq(0).find('td').eq(4).find('mat-icon').click()

      cy.get('mat-dialog-content').contains(
        'Eric Di Bari has had RPM disabled since Mon, Jun 5 2023'
      )
    })

    it('should enable new episode', () => {
      standardSetup({
        apiOverrides: [
          {
            url: '/1.0/care-management/state/audit**',
            fixture: 'api/general/emptyDataEmptyPagination'
          }
        ]
      })

      cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

      cy.get('.ccr-dashboard')
      cy.get('[data-cy="open-status-button"]').click()
      cy.get('[data-cy="program_setting_button"]').click()

      cy.get('mat-dialog-container')
        .find('app-dialog-care-mgmt-card')
        .eq(0)
        .find('.add-button')
        .should('exist')
        .click()

      cy.get('mat-dialog-container')
        .find('textarea')
        .should('be.enabled')
        .eq(0)
        .type('test primary diagnosis', { force: true })
        .trigger('blur')
        .trigger('change')

      cy.tick(1000)

      cy.get('mat-dialog-container')
        .find('button')
        .contains('Next')
        .click({ force: true })

      cy.get('mat-dialog-container')
        .find('.mat-checkbox-inner-container')
        .click({ force: true, multiple: true })

      cy.get('mat-dialog-container')
        .find('button')
        .contains('Next')
        .click({ force: true })

      cy.get('mat-dialog-container')
        .find('.image-option')
        .eq(0)
        .click({ force: true })

      cy.get('button').contains('Enable RPM').click({ force: true })

      cy.get('.mat-snack-bar-container').should(
        'have.text',
        'The care service has been successfully enabled for this patient.'
      )
    })
  })

  describe('Billing codes', () => {
    for (const entry of serviceTypeList) {
      it(`${entry.serviceType.name}: show correct billable codes`, () => {
        window.localStorage.setItem(
          STORAGE_ACTIVE_CARE_MANAGEMENT_SERVICE_TYPE,
          entry.serviceType.id
        )

        standardSetup({
          apiOverrides: [
            {
              url: '/1.0/warehouse/care-management/billing/snapshot**',
              fixture: `api/warehouse/get${entry.serviceType.name}BillingSnapshot`
            },
            {
              url: '/1.0/care-management/state?**',
              fixture: `api/care-management/getAllCareStates`
            }
          ]
        })

        cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

        cy.get('.ccr-dashboard')
        cy.get('[data-cy="care-management-state"]')
          .find('mat-select')
          .should('contain', entry.serviceType.name)

        cy.wait('@careManagementStates')
        cy.tick(1000)
        cy.wait(1000)
        cy.get('[data-cy="open-status-button"]').click({ force: true })
        cy.get('app-rpm-status-panel')
          .find('.code-container')
          .as('billingCodeRow')

        for (let i = 0; i < entry.billingCodes.length; i += 1) {
          cy.get('@billingCodeRow')
            .eq(i)
            .find('.code')
            .should('contain', entry.billingCodes[i])
        }
      })
    }
  })
})

function checkVisibility(visible: boolean, apiOverrides?: ApiOverrideEntry[]) {
  standardSetup({ apiOverrides })

  cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)
  cy.get('.ccr-dashboard')
  cy.get('[data-cy="care-management-state"]').should(
    visible ? 'exist' : 'not.exist'
  )
}

function checkServiceSelection(serviceType?: { id: string; name: string }) {
  standardSetup()

  cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)
  cy.get('.ccr-dashboard')

  if (serviceType) {
    cy.get('[data-cy="care-management-state"]')
      .find('mat-select')
      .should('contain', serviceType.name)
      .then(() => {
        expect(
          window.localStorage.getItem(
            STORAGE_ACTIVE_CARE_MANAGEMENT_SERVICE_TYPE
          )
        ).to.equal(serviceType.id)
      })
  } else {
    cy.wait(1000)
    cy.get('[data-cy="care-management-state"]')
      .find('mat-select')
      .should('contain', '')
  }
}

function checkActivePassedSessions({
  fixture,
  activeSessionsDate,
  passedSessions
}: {
  fixture: string
  activeSessionsDate?: string[]
  passedSessions?: {
    serviceType: string
    startDate: string
    endDate: string
    disabledBy: string
  }[]
}) {
  standardSetup({
    apiOverrides: [
      {
        url: '/1.0/care-management/state/audit**',
        fixture: `api/care-management/state-audit/${fixture}`
      }
    ]
  })

  cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

  cy.get('.ccr-dashboard')
  cy.get('[cy-data="open-status-button"]').click()
  cy.get('[cy-data="program_setting_button"]').click()

  if (activeSessionsDate) {
    activeSessionsDate.forEach((date, index) => {
      cy.get('app-dialog-care-mgmt-card')
        .eq(index)
        .find('.start-date')
        .contains(date)
    })
  } else {
    cy.get('app-dialog-care-mgmt-card')
      .eq(0)
      .find('.start-date')
      .should('not.exist')
  }

  if (passedSessions) {
    cy.get('table').find('tbody tr').as('passedSessions')
    cy.get('@passedSessions').should('have.length', passedSessions.length)
    passedSessions.forEach((session, index) => {
      cy.get('@passedSessions')
        .eq(index)
        .find('td')
        .eq(0)
        .contains(session.serviceType)
      cy.get('@passedSessions')
        .eq(index)
        .find('td')
        .eq(1)
        .contains(session.startDate)
      cy.get('@passedSessions')
        .eq(index)
        .find('td')
        .eq(2)
        .contains(session.endDate)
      cy.get('@passedSessions')
        .eq(index)
        .find('td')
        .eq(3)
        .contains(session.disabledBy)
    })
  } else {
    cy.get('table').find('tbody tr').should('not.exist')
  }
}
