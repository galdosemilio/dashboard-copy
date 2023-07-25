import { standardSetup } from '../../../../support'

describe('Dashboard -> Patients -> Patient -> More -> Devices', function () {
  beforeEach(() => {
    cy.setTimezone('et')
    standardSetup({
      startDate: Date.UTC(2023, 6, 18)
    })

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings;s=devices`)
    cy.wait('@getTypes')
  })

  it('Adds cellular device to dashboard', function () {
    cy.get('select[name="devices"]').within(() => {
      cy.get('option').eq(1).trigger('click', { force: true })
    })

    cy.get('app-cellular-device-form').find('input').type('1234800')

    cy.intercept('POST', '/1.0/account/**/cellular-device', (req) => {
      req.reply({ statusCode: 200 })
    }).as('addDevice')

    cy.intercept('GET', '/1.0/account/**/cellular-device', {
      fixture: 'api/cellular-device/getAddedDevice'
    }).as('getAddedDevice')

    cy.get('app-cellular-device-form').find('button').click()

    cy.wait('@addDevice').then((interception) => {
      expect(interception.response.statusCode).to.equal(200)
    })

    cy.get('app-cellular-device-table').within(() => {
      cy.get('mat-row').as('cellularDeviceRows')
    })

    cy.get('@cellularDeviceRows').should('have.length', 1)
  })

  it('Opens sync dialog on button click', function () {
    cy.get('app-cellular-device-table').within(() => {
      cy.get('mat-row').as('cellularDeviceRows')
    })

    cy.get('@cellularDeviceRows')
      .eq(0)
      .find('button#sync-btn')
      .find('mat-icon')
      .should('exist')
      .should('have.text', 'sync')

    cy.get('app-cellular-device-table').within(() => {
      cy.get('mat-row').as('cellularDeviceRows')
      cy.get('#sync-btn').click()
    })

    cy.get('.sync_form-title h2').should('have.text', 'Manual Device Sync')
  })

  it('Should have the correct default values on the sync dialog', function () {
    cy.get('#sync-btn').click()
    cy.get('.sync_form').as('syncForm')

    cy.get('mat-select[formcontrolname="duration"]')
      .find('.mat-select-value')
      .should('have.text', '2 Weeks')

    cy.get('input[formcontrolname="fromDate"]').should(
      'have.value',
      'Jul 3, 2023'
    )
  })

  it('Should adjust the end date when the duration is changed', function () {
    cy.get('#sync-btn').click()
    cy.get('.sync_form').as('syncForm')

    cy.get('mat-select[formControlName="duration"]')
      .click()
      .get('mat-option', { withinSubject: null })
      .contains('3 Days')
      .click()

    cy.get('input[formcontrolname="fromDate"]').should(
      'have.value',
      'Jul 14, 2023'
    )
  })

  it('Should send correct data to the API and display success message', function () {
    cy.get('#sync-btn').click()
    cy.get('.sync_form').as('syncForm')

    cy.get('button').contains('Sync').click()

    cy.wait('@bodytraceSync').then((interception) => {
      expect(interception.response.statusCode).to.equal(204)
      expect(interception.request.body.start).to.equal(
        '2023-07-03T04:00:00.000Z'
      )
      expect(interception.request.body.end).to.equal('2023-07-17T04:00:00.000Z')
    })

    cy.get('.mat-snack-bar-container').should(
      'have.text',
      'Manual sync successfully'
    )
    cy.get('#mat-dialog-title-1').should('not.exist')
  })

  it('Should display error message when sync fails', function () {
    cy.intercept('POST', '/1.0/measurement/bodytrace/sync', {
      statusCode: 500
    }).as('bodytraceSync')

    cy.get('#sync-btn').click()
    cy.get('.sync_form').as('syncForm')

    cy.get('button').contains('Sync').click()

    cy.wait('@bodytraceSync').then((interception) => {
      expect(interception.response.statusCode).to.equal(500)
    })

    cy.get('.mat-snack-bar-container').should('have.text', 'Manual sync failed')
    cy.get('#mat-dialog-title-1').should('exist')
  })

  it('Checks for dialog select options', function () {
    cy.get('#sync-btn').click()
    cy.get('.sync_form').as('syncForm')

    cy.get('@syncForm').within(() => {
      cy.get('mat-select[formControlName="duration"]').click()

      cy.get('mat-option', { withinSubject: null })
        .should('be.visible')
        .should('have.length', 4)
        .each(($option, index) => {
          const expectedOptions = ['1 Day', '3 Days', '1 Week', '2 Weeks']
          cy.wrap($option)
            .invoke('text')
            .then((text) => {
              expect(text.trim()).to.equal(expectedOptions[index])
            })
        })
    })
  })
})
