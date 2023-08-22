import { standardSetup } from '../../../../support'

describe('Dashboard -> Patients -> Patient -> More -> Devices', function () {
  beforeEach(() => {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings;s=devices`)
  })
  it('Populates select dropdown with cellular device type data', function () {
    cy.intercept('GET', '/1.0/cellular-device/type', {
      fixture: 'api/cellular-device/getAllTypes'
    }).as('getTypes')

    cy.wait('@getTypes')

    cy.get('select[name="devices"]').within(() => {
      cy.get('option').should('have.length', 2)
      cy.get('option')
        .eq(0)
        .contains('BodyTrace scale (BT-005)')
        .should('exist')
      cy.get('option')
        .eq(1)
        .contains('BodyTrace blood pressure cuff (BT-105)')
        .should('exist')
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
      .find('button#delete-btn')
      .find('mat-icon')
      .should('exist')
      .should('have.text', 'delete')
  })

  it('Removes added cellular device device', function () {
    let interceptCount = 0

    cy.intercept('GET', '/1.0/account/**/cellular-device', (req) => {
      req.reply((res) => {
        if (interceptCount === 0) {
          interceptCount += 1
          res.send({
            fixture: 'api/cellular-device/getAddedDevice',
            statusCode: 200
          })
        } else {
          res.send({ fixture: 'api/cellular-device/empty', statusCode: 200 })
        }
      })
    }).as('getAddedDevice')

    cy.wait('@getAddedDevice')

    cy.intercept('DELETE', '/1.0/account/**/cellular-device/**', (req) => {
      req.reply({ statusCode: 200 })
    }).as('removeAddedDevice')

    cy.get('#delete-btn').click()

    cy.wait('@removeAddedDevice').then((interception) => {
      expect(interception.response.statusCode).to.equal(200)
    })

    cy.wait('@getAddedDevice')

    cy.get('app-cellular-device-table').within(() => {
      cy.get('mat-row').should('not.exist')
    })
  })
})
