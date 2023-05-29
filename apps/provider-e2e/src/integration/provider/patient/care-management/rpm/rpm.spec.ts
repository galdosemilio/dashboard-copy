import { standardSetup } from '../../../../../support'
const STORAGE_CARE_MANAGEMENT_SERVICE_TYPE = 'ccrCareManagementServiceType'

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

describe('Patient profile -> dashboard -> rpm', function () {
  beforeEach(() => {
    cy.setOrganization('mdteam')
  })

  describe('visibility', () => {
    it('should show care management state', () => {
      standardSetup()

      cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

      cy.get('.ccr-dashboard')
      cy.get('[cy-data="care-management-state"]').should('exist')
    })

    it('should not show with authenticated provider has no active service types enabled', () => {
      standardSetup({
        apiOverrides: [
          {
            url: '/1.0/care-management/service-type/account?**',
            fixture: 'api/care-management/getInActiveServiceTypeAccount'
          }
        ]
      })

      cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)
      cy.get('.ccr-dashboard')
      cy.get('[cy-data="care-management-state"]').should('not.exist')
    })

    it('should not show with currently-selected clinic context has no active service types', () => {
      standardSetup({
        apiOverrides: [
          {
            url: '/1.0/care-management/preference/organization?**',
            fixture: 'api/care-management/getInActivePreferenceOrganization'
          }
        ]
      })

      cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)
      cy.get('.ccr-dashboard')
      cy.get('[cy-data="care-management-state"]').should('not.exist')
    })

    it('should not show with the authenticated provider has some active service types enabled that do not overlap/are shared by the currently-select clinic context', () => {
      standardSetup({
        apiOverrides: [
          {
            url: '/1.0/care-management/preference/organization?**',
            fixture: 'api/general/emptyDataEmptyPagination'
          }
        ]
      })

      cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)
      cy.get('.ccr-dashboard')
      cy.get('[cy-data="care-management-state"]').should('not.exist')
    })
  })

  describe('selection', () => {
    it('should select first one by default and set session', () => {
      localStorage.removeItem(STORAGE_CARE_MANAGEMENT_SERVICE_TYPE)

      standardSetup()

      cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

      cy.get('.ccr-dashboard')
      cy.get('[cy-data="care-management-state"]')
        .find('mat-select')
        .should('contain', 'RPM')
        .then(() => {
          expect(
            window.localStorage.getItem(STORAGE_CARE_MANAGEMENT_SERVICE_TYPE)
          ).to.equal('1')
        })
    })

    it('should select first one by default if the session exists but not available', () => {
      window.localStorage.setItem(STORAGE_CARE_MANAGEMENT_SERVICE_TYPE, '5')

      standardSetup()

      cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

      cy.get('.ccr-dashboard')
      cy.get('[cy-data="care-management-state"]')
        .find('mat-select')
        .should('contain', 'RPM')
        .then(() => {
          expect(
            window.localStorage.getItem(STORAGE_CARE_MANAGEMENT_SERVICE_TYPE)
          ).to.equal('1')
        })
    })

    it('should select with available session', () => {
      window.localStorage.setItem(STORAGE_CARE_MANAGEMENT_SERVICE_TYPE, '2')

      standardSetup()

      cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

      cy.get('.ccr-dashboard')
      cy.get('[cy-data="care-management-state"]')
        .find('mat-select')
        .should('contain', 'CCM')
        .then(() => {
          expect(
            window.localStorage.getItem(STORAGE_CARE_MANAGEMENT_SERVICE_TYPE)
          ).to.equal('2')
        })
    })

    it('should show no program', () => {
      standardSetup({
        apiOverrides: [
          {
            url: '/1.0/care-management/state?**',
            fixture: 'api/general/emptyDataEmptyPagination'
          }
        ]
      })

      cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)
      cy.get('.ccr-dashboard')

      cy.wait(1000)
      cy.get('[cy-data="care-management-state"]')
        .find('mat-select')
        .should('contain', '')
    })
  })

  describe('timeTracking', () => {
    it('should set select care service type in event', () => {
      window.localStorage.setItem(STORAGE_CARE_MANAGEMENT_SERVICE_TYPE, '1')

      standardSetup()

      cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

      cy.get('.ccr-dashboard')
      cy.get('[cy-data="care-management-state"]')
        .find('mat-select')
        .should('contain', 'RPM')

      cy.tick(10000)

      cy.get('.ccr-tabs').find('a').eq(1).click()

      cy.wait('@accountActivityPostRequest')
      cy.wait('@accountActivityPostRequest').should((xhr) => {
        expect(xhr.response.statusCode).to.equal(201)
        expect(xhr.request.body.tags.includes('rpm')).to.equal(true)
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
      cy.get('[cy-data="open-status-button"]').click()
      cy.get('[cy-data="program_setting_button"]').click()

      cy.get('app-dialog-care-mgmt-card').should('have.length', 2)
      cy.get('app-dialog-care-mgmt-card').eq(0).contains('RPM')
      cy.get('app-dialog-care-mgmt-card').eq(1).contains('CCM')
    })

    it.skip('should enable new episode', () => {
      standardSetup({
        apiOverrides: [
          {
            url: '/1.0/care-management/state?**',
            fixture: 'api/general/emptyDataEmptyPagination'
          }
        ]
      })

      cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`)

      cy.get('.ccr-dashboard')
      cy.get('[cy-data="open-status-button"]').click()
      cy.get('[cy-data="program_setting_button"]').click()

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
    })
  })

  describe('Billing codes', () => {
    for (const entry of serviceTypeList) {
      it(`${entry.serviceType.name}: show correct billable codes`, () => {
        window.localStorage.setItem(
          STORAGE_CARE_MANAGEMENT_SERVICE_TYPE,
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
        cy.get('[cy-data="care-management-state"]')
          .find('mat-select')
          .should('contain', entry.serviceType.name)

        cy.wait('@careManagementStates')
        cy.tick(1000)
        cy.wait(1000)
        cy.get('[cy-data="open-status-button"]').click({ force: true })
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
