import { standardSetup } from '../../../support'
import { selectOption } from '../../helpers'

function assertDefaultAlerts(): void {
  cy.tick(10000)
  cy.get('@alertTitles').eq(0).should('contain', 'Weight Regain')
  cy.get('@alertTitles').eq(1).should('contain', 'Meal Inactivity')
  cy.get('@alertTitles').eq(2).should('contain', 'Scale Inactivity')
  cy.get('@alertTitles').eq(3).should('contain', 'Tracker Inactivity')
  cy.get('@alertTitles').eq(4).should('contain', 'Weight Threshold')
  cy.get('@alertTitles').eq(11).should('contain', 'Threshold Alert - Weight')
  cy.get('@alertTitles')
    .eq(12)
    .should('contain', 'Threshold Alert - Fat mass weight')
  cy.get('small').should('contain', 'Inherited from CoachCare')
}

describe('Dashboard -> Alerts', function () {
  it('Seven alerts exist for CoachCare org', function () {
    cy.setOrganization('ccr')
    standardSetup()
    cy.visit(`/alerts/settings`)

    cy.get('[data-cy="alert-title"]').as('alertTitles')

    cy.get('@alertTitles').should('have.length', 14)
    assertDefaultAlerts()
  })

  it('Seven alerts exist for CMWL org', function () {
    cy.setOrganization('cmwl')
    standardSetup()
    cy.visit(`/alerts/settings`)

    cy.get('[data-cy="alert-title"]').as('alertTitles')

    cy.get('@alertTitles').should('have.length', 14)
    assertDefaultAlerts()
  })

  it('Seven alerts exist for inHealth org', function () {
    cy.setOrganization('inhealth')
    standardSetup()
    cy.visit(`/alerts/settings`)

    cy.get('[data-cy="alert-title"]').as('alertTitles')

    cy.get('@alertTitles').should('have.length', 14)
    assertDefaultAlerts()
  })

  it('Seven alerts exist for MDTeam org', function () {
    cy.setOrganization('mdteam')
    standardSetup()
    cy.visit(`/alerts/settings`)

    cy.get('[data-cy="alert-title"]').as('alertTitles')

    cy.get('@alertTitles').should('have.length', 14)
    assertDefaultAlerts()
  })

  it('Should create a Data Threshold Alert', function () {
    cy.setOrganization('ccr')
    standardSetup()
    cy.visit(`/alerts/settings`)

    cy.get('app-alerts-settings')
      .find('button')
      .contains('Add New Alert')
      .click()

    cy.tick(1000)

    cy.get('mat-dialog-container').find('mat-radio-button').eq(0).click()

    cy.tick(1000)

    cy.get('input[type="number"]').eq(0).type('100')

    cy.tick(1000)

    cy.get('mat-dialog-container').find('button').contains('Save').click()

    cy.tick(1000)

    cy.wait('@createAlertPreferenceRequest').should((xhr) => {
      expect(xhr.request.body).to.deep.equal({
        alertType: '4',
        organization: '1',
        preference: {
          isActive: true,
          options: {
            analysis: {
              period: '1 hour'
            },
            dataPoint: {
              type: { id: '46' },
              value: 100000
            },
            direction: 'above'
          }
        }
      })
    })
  })

  it('Should update a Data Threshold Alert', function () {
    cy.setOrganization('ccr')
    standardSetup()
    cy.visit(`/alerts/settings`)

    cy.get('[data-cy="alert-title"]')
      .contains('Threshold Alert')
      .eq(0)
      .parent()
      .parent()
      .parent()
      .find('mat-icon')
      .contains('edit')
      .click()

    cy.get('mat-dialog-container').find('mat-spinner').tick(10000)

    cy.get('mat-dialog-container')
      .find('button')
      .contains('Save')
      .parent()
      .should('not.have.class', 'mat-button-disabled')
      .click()

    cy.wait('@patchAlertPreferenceRequest').should((xhr) => {
      expect(xhr.request.body).to.deep.equal({
        id: '627',
        preference: {
          isActive: true,
          options: {
            analysis: {
              period: '1 hour'
            },
            dataPoint: {
              type: { id: '1' },
              value: 110231.92784
            },
            direction: 'above'
          }
        }
      })
    })
  })

  it('Should create a Data Point Missing Alert', function () {
    cy.setOrganization('ccr')
    standardSetup()
    cy.visit(`/alerts/settings`)

    cy.get('app-alerts-settings')
      .find('button')
      .contains('Add New Alert')
      .click()

    cy.tick(1000)

    selectOption(
      cy.get('mat-dialog-container').find('mat-select').eq(0),
      'Missing Data Alert'
    )

    cy.get('mat-dialog-container').find('button').contains('Save').click()

    cy.tick(1000)

    cy.wait('@createAlertPreferenceRequest').should((xhr) => {
      expect(xhr.request.body).to.deep.equal({
        alertType: '5',
        organization: '1',
        preference: {
          isActive: true,
          options: {
            analysis: {
              period: '1 day'
            },
            dataPoint: {
              type: { id: '46' }
            }
          }
        }
      })
    })
  })

  it('Should update a Data Point Missing Alert', function () {
    cy.setOrganization('ccr')
    standardSetup()
    cy.visit(`/alerts/settings`)

    cy.get('[data-cy="alert-title"]')
      .contains('Missing Data Alert')
      .eq(0)
      .parent()
      .parent()
      .parent()
      .find('mat-icon')
      .contains('edit')
      .click()

    cy.get('mat-dialog-container').find('mat-spinner').tick(10000)

    cy.get('mat-dialog-container')
      .find('button')
      .contains('Save')
      .parent()
      .should('not.have.class', 'mat-button-disabled')
      .click()

    cy.wait('@patchAlertPreferenceRequest').should((xhr) => {
      expect(xhr.request.body).to.deep.equal({
        id: '647',
        preference: {
          isActive: true,
          options: {
            analysis: {
              period: '2 days'
            },
            dataPoint: {
              type: { id: '1' }
            }
          }
        }
      })
    })
  })

  it('Should delete a Data Point Alert', function () {
    cy.setOrganization('ccr')
    standardSetup()
    cy.visit(`/alerts/settings`)

    cy.get('[data-cy="alert-title"]')
      .contains('Threshold Alert')
      .eq(0)
      .parent()
      .parent()
      .parent()
      .find('mat-icon')
      .contains('delete')
      .click()

    cy.get('mat-dialog-container').find('button').contains('Yes').click()

    cy.wait('@deleteAlertPreferenceRequest').should((xhr) => {
      expect(xhr.request.url).to.contain('627')
    })
  })

  it('Properly lists notifications in the table', function () {
    cy.setOrganization('ccr')
    standardSetup()
    cy.visit(`/alerts/notifications`)

    cy.get('mat-table').find('mat-row').as('notifRows').tick(10000)

    cy.get('@notifRows')
      .eq(0)
      .should('contain', 'Meal logging')
      .should('contain', 'No meals logged')
    cy.get('@notifRows')
      .eq(1)
      .should('contain', 'Threshold Alert')
      .should('contain', 'Body fat')
      .should('contain', '39% 13% above 26% threshold')
    cy.get('@notifRows')
      .eq(2)
      .should('contain', 'Missing Data Alert')
      .should('contain', 'Heart rate')
      .should('contain', 'No data in the previous 3 days')
  })

  describe('Alerts Filters', function () {
    beforeEach(function () {
      cy.setOrganization('ccr')
      standardSetup({
        startDate: new Date().getTime()
      })
    })

    it('Properly load filters from local storage', function () {
      window.localStorage.setItem(
        `ccrAlertsFilters_${Cypress.env('organizationId')}`,
        JSON.stringify({
          value: {
            rpmStatus: 'active'
          },
          expiry: new Date().getTime() + 1000 * 60 * 60 * 24 * 30
        })
      )
      cy.visit(`/alerts/notifications`)

      cy.get('mat-table').find('mat-row').as('notifRows').tick(10000)

      cy.get('[data-cy="rpmStatus"]')
        .find('.mat-select-value-text')
        .should('contain', 'PATIENTS CURRENTLY ENROLLED IN RPM')
    })

    it('Properly respects expired filters', function () {
      window.localStorage.setItem(
        `ccrAlertsFilters_${Cypress.env('organizationId')}`,
        JSON.stringify({
          value: {
            rpmStatus: 'active'
          },
          expiry: new Date().getTime() - 1000 * 60 * 60 * 24 * 30
        })
      )
      cy.visit(`/alerts/notifications`)

      cy.get('mat-table').find('mat-row').as('notifRows').tick(10000)

      cy.get('[data-cy="rpmStatus"]')
        .find('.mat-select-value-text')
        .should('not.exist')
    })

    it('Properly saves filters to local storage', function () {
      cy.visit(`/alerts/notifications`)

      cy.get('mat-table').find('mat-row').as('notifRows').tick(10000)

      cy.get('[data-cy="rpmStatus"]').click().wait(500)
      cy.get('.mat-option').eq(1).click()

      cy.get('[data-cy="rpmStatus"]')
        .find('.mat-select-value-text')
        .should('contain', 'PATIENTS CURRENTLY ENROLLED IN RPM')

      cy.getAllLocalStorage().then((ls) => {
        expect(ls['http://localhost:4200']).to.have.property(
          `ccrAlertsFilters_${Cypress.env('organizationId')}`
        )
        const filter =
          ls['http://localhost:4200'][
            `ccrAlertsFilters_${Cypress.env('organizationId')}`
          ]
        expect(JSON.parse(filter as string)['value']).to.deep.equal({
          package: null,
          rpmStatus: 'active'
        })
      })
    })

    it('Property saves pagination to local storage', function () {
      cy.visit(`/alerts/notifications`)

      cy.get('mat-table').find('mat-row').as('notifRows').tick(10000)

      cy.get('button[aria-label="Next page"]').click()

      cy.getAllLocalStorage().then((ls) => {
        expect(ls['http://localhost:4200']).to.have.property(
          `ccrAlertsFilters_${Cypress.env('organizationId')}`
        )
        const filter =
          ls['http://localhost:4200'][
            `ccrAlertsFilters_${Cypress.env('organizationId')}`
          ]
        expect(JSON.parse(filter as string)['value']).to.deep.equal({
          package: null,
          offset: 1
        })
      })
    })

    it('Properly resets pagination in local storage when no data its loaded', function () {
      window.localStorage.setItem(
        `ccrAlertsFilters_${Cypress.env('organizationId')}`,
        JSON.stringify({
          value: {
            package: null,
            offset: 1
          },
          expiry: new Date().getTime() + 1000 * 60 * 60 * 24 * 30
        })
      )
      cy.intercept('GET', '/1.0/warehouse/alert/notification?**', {
        body: { data: [], pagination: {} }
      }).as('getNotificationsRequest')
      cy.visit(`/alerts/notifications`)
      cy.wait('@getNotificationsRequest')

      cy.getAllLocalStorage().then((ls) => {
        const filter =
          ls['http://localhost:4200'][
            `ccrAlertsFilters_${Cypress.env('organizationId')}`
          ]
        expect(JSON.parse(filter as string)['value']).to.deep.equal({
          package: null
        })
      })
    })

    it('Properly clears filters from local storage when incorrect package its loaded', function () {
      window.localStorage.setItem(
        `ccrAlertsFilters_${Cypress.env('organizationId')}`,
        JSON.stringify({
          value: {
            package: 4
          },
          expiry: new Date().getTime() + 1000 * 60 * 60 * 24 * 30
        })
      )
      cy.visit(`/alerts/notifications`)
      cy.get('mat-table').find('mat-row').as('notifRows').tick(10000)

      cy.getAllLocalStorage().then((ls) => {
        const filter =
          ls['http://localhost:4200'][
            `ccrAlertsFilters_${Cypress.env('organizationId')}`
          ]
        expect(JSON.parse(filter as string)['value']).to.not.deep.equal({
          package: 4
        })
      })
    })
  })
})
