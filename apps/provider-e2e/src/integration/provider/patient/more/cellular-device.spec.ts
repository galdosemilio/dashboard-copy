import { standardSetup } from '../../../../support'

describe('Dashboard -> Patients -> Patient -> More -> Devices', function () {
  before(() => {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings;s=devices`)
  })
  it('Populates select dropdown with cellular device type data', function () {
    cy.intercept('GET', '/1.0/cellular-device/type', {
      fixture: 'api/cellular-device/getAllTypes'
    }).as('getTypes')

    // it looks like i need to wait for some core api's to load (eg. /meeting/type/organization/)
    // before i could test for @getTypes
    // otherwise it is always in timeout
    // any better way to do this?
    cy.wait(40000)
    cy.wait('@getTypes')

    cy.get('select[name="devices"]').within(() => {
      cy.get('option').should('have.length', 2)
      cy.get('option').eq(0).should('have.text', 'BodyTrace scale (BT-005)')
      cy.get('option')
        .eq(1)
        .should('have.text', 'BodyTrace blood pressure cuff (BT-105)')
    })
  })

  it('Lists added cellular device device', function () {
    cy.get('select[name="devices"]').within(() => {
      cy.get('option').eq(1).trigger('click', { force: true })
    })

    cy.get('app-cellular-device-form').find('input').type('1234800')

    cy.intercept('POST', '/1.0/account/**/cellular-device', (req) => {
      expect(req.body).to.have.property('type', '1')
      expect(req.body).to.have.property('identifier', '1234800')

      req.reply({ statusCode: 200 })
    }).as('addDevice')

    cy.intercept('GET', '/1.0/account/**/cellular-device', {
      fixture: 'api/cellular-device/getAddedDevice'
    }).as('getAddedDevice')

    cy.get('app-cellular-device-form')
      .find('button')
      .should('have.css', 'background-color', 'rgb(240, 93, 92)')
      .click()

    cy.wait('@addDevice').then((interception) => {
      expect(interception.response.statusCode).to.equal(200)
    })

    cy.wait('@getAddedDevice')

    cy.get('app-cellular-device-table').within(() => {
      cy.get('mat-row').as('cellularDeviceRows')
    })

    cy.get('@cellularDeviceRows').should('have.length', 1)

    cy.get('@cellularDeviceRows')
      .eq(0)
      .should('contain', 'BodyTrace blood pressure cuff (BT-105)')
      .should('contain', '1234800')
      .find('mat-icon')
      .should('exist')
      .should('have.text', 'delete')
  })

  it('Removes added cellular device device', function () {
    cy.intercept('DELETE', '/1.0/account/**/cellular-device/**', (req) => {
      req.reply({ statusCode: 200 })
    }).as('removeAddedDevice')

    cy.intercept('GET', '/1.0/account/**/cellular-device', (req) => {
      req.reply((res) => {
        res.send({
          fixture: 'api/cellular-device/empty'
        })
      })
    }).as('removed')

    cy.get('#delete-btn').click()

    cy.wait('@removeAddedDevice').then((interception) => {
      expect(interception.response.statusCode).to.equal(200)
    })

    cy.wait('@removed')

    cy.get('app-cellular-device-table').within(() => {
      cy.get('mat-row').should('not.exist')
    })
  })
})