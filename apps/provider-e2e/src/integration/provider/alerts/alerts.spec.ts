import { standardSetup } from '../../../support'

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

    cy.get('@alertTitles').should('have.length', 13)
    assertDefaultAlerts()
  })

  it('Seven alerts exist for CMWL org', function () {
    cy.setOrganization('cmwl')
    standardSetup()
    cy.visit(`/alerts/settings`)

    cy.get('[data-cy="alert-title"]').as('alertTitles')

    cy.get('@alertTitles').should('have.length', 13)
    assertDefaultAlerts()
  })

  it('Seven alerts exist for inHealth org', function () {
    cy.setOrganization('inhealth')
    standardSetup()
    cy.visit(`/alerts/settings`)

    cy.get('[data-cy="alert-title"]').as('alertTitles')

    cy.get('@alertTitles').should('have.length', 13)
    assertDefaultAlerts()
  })

  it('Seven alerts exist for MDTeam org', function () {
    cy.setOrganization('mdteam')
    standardSetup()
    cy.visit(`/alerts/settings`)

    cy.get('[data-cy="alert-title"]').as('alertTitles')

    cy.get('@alertTitles').should('have.length', 13)
    assertDefaultAlerts()
  })

  it('Should create a Data Threshold Alert', function () {
    cy.setOrganization('ccr')
    standardSetup()
    cy.visit(`/alerts/settings`)

    cy.get('span.title-text').contains('Add New Threshold Alert').click()

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

  it('Should delete a Data Threshold Alert', function () {
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
      .should('contain', '13% above 26% threshold (39%)')
  })
})
