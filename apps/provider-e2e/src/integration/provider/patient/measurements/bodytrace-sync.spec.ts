import { standardSetup } from '../../../../support'

describe('Dashboard -> Patients -> Patient -> More -> Devices', function () {
  before(() => {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings;s=devices`)
  })

  it('Adds cellular device to dashboard', function () {
    cy.intercept('GET', '/1.0/cellular-device/type', {
      fixture: 'api/cellular-device/getAllTypes'
    }).as('getTypes')

    cy.wait('@getTypes')

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

    cy.get('.sync_form-title h2').should('have.text', 'MANUAL DEVICE SYNC')
  })

  it('Checks for dialog select options', function () {
    cy.get('.sync_form').as('syncForm')

    cy.get('@syncForm').within(() => {
      cy.get('mat-select[formControlName="duration"]').click()

      cy.get('mat-option', { withinSubject: null })
        .should('be.visible')
        .should('have.length', 4)
        .each(($option, index) => {
          const expectedOptions = ['1 day', '3 days', '1 week', '2 weeks']
          cy.wrap($option)
            .invoke('text')
            .then((text) => {
              expect(text.trim()).to.equal(expectedOptions[index])
            })
        })
    })
  })
})
