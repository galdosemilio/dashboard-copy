import { standardSetup } from '../../../support'

describe('Provider Sidenav', function () {
  describe('Care Management report', function () {
    it('Loads link for allowed users', function () {
      setup()

      cy.get('@menuLinks')
        .find('app-sidenav-item span:visible')
        .contains('Care Management')
        .should('exist')
    })

    it('Does not load link for disallowed users', function () {
      setup(false)

      cy.get('@menuLinks')
        .find('app-sidenav-item span:visible')
        .contains('Care Management')
        .should('not.exist')
    })
  })
})

function setup(allowPermissions = true) {
  cy.setOrganization('ccr')
  standardSetup()
  if (!allowPermissions) {
    cy.fixture('api/care-management/getServiceTypeAccount').then(({ data }) => {
      data.forEach((service) => {
        service.status = 'inactive'
      })

      cy.intercept('GET', '/1.0/care-management/service-type/account?**', data)
    })
  }
  cy.visit('/')

  cy.get('app-menu').find('app-sidenav-item').not('.hidden').as('menuLinks')
  cy.get('@menuLinks').get('app-sidenav-item').contains('Reports').click()
}
