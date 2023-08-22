import { standardSetup } from '../../../support'
import { ValidOrganization } from '../../../support/organizations'

function setup(clinic: ValidOrganization, clinicStore: boolean) {
  cy.fixture('api/organization/getMala').then((malaFixture) => {
    cy.setOrganization(clinic)
    standardSetup()

    if (!clinicStore) {
      delete malaFixture.storeUrl
    }

    cy.intercept('GET', `/4.0/organization/*/preference**`, malaFixture)

    cy.visit('/dashboard')

    cy.window().then((win) => {
      cy.stub(win, 'open').as('open')
    })
  })
}

describe('Lefthand menu store links', function () {
  describe('CoachCare Store', function () {
    it('CoachCare store link resolves to store.coachcare.com', function () {
      setup('ccr', true)

      cy.get('app-menu', {
        timeout: 12000
      })
        .find('app-sidenav-item')
        .not('.hidden')
        .as('menuLinks')

      cy.get('@menuLinks').eq(20).should('contain', 'Store')
      cy.get('@menuLinks').eq(20).click()
      cy.get('@open').should(
        'have.been.calledWith',
        'https://store.coachcare.com/'
      )
    })

    it('CoachCare store link not shown when section config is not set', function () {
      setup('cmwl', false)

      cy.get('app-menu', {
        timeout: 12000
      })
        .find('app-sidenav-item')
        .not('.hidden')
        .as('menuLinks')
        .contains('Store')
        .should('not.exist')
    })

    it('Clinic store link resolves to proper storefront URL', function () {
      setup('ccr', true)

      cy.get('app-menu', {
        timeout: 12000
      })
        .find('app-sidenav-item')
        .not('.hidden')
        .as('menuLinks')

      cy.get('@menuLinks').eq(21).should('contain', 'Store')
      cy.get('@menuLinks').eq(21).click()
      cy.get('@open').should(
        'have.been.calledWith',
        `http://localhost:4200/storefront?baseOrg=1`
      )
    })

    it('Clinic store link not shown when storeUrl is not set and STORE_CLINIC_USES_SHOPIFY not set', function () {
      setup('ccr', false)

      cy.get('app-menu', {
        timeout: 12000
      })
        .find('app-sidenav-item')
        .not('.hidden')
        .as('menuLinks')

      cy.get('@menuLinks').eq(19).should('contain', 'Sequences')
      cy.get('@menuLinks').eq(20).should('contain', 'Store')
      cy.get('@menuLinks').eq(21).should('contain', 'Resources')
      cy.get('@menuLinks').eq(20).click()
      cy.get('@open').should(
        'have.been.calledWith',
        'https://store.coachcare.com/'
      )
    })
  })
  describe('Clinic Store', function () {
    it('Use custom link text for clinic link, as set in section config, and override shopifyUrl', function () {
      setup('musclewise', true)

      cy.get('app-menu', {
        timeout: 12000
      })
        .find('app-sidenav-item')
        .not('.hidden')
        .as('menuLinks')
        .contains('Manage My Subscription')
        .should('exist')
        .click()

      cy.get('@open').should(
        'have.been.calledWith',
        `http://localhost:4200/storefront?baseOrg=7537`
      )
    })
    it('Do not show shopifyUrl for provider, if storeUrl is not set', function () {
      setup('musclewise', false)

      cy.get('app-menu', {
        timeout: 12000
      })
        .find('app-sidenav-item')
        .not('.hidden')
        .as('menuLinks')
        .contains('Manage My Subscription')
        .should('not.exist')
    })
  })
})
