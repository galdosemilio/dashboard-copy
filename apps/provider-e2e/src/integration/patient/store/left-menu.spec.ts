import { setupEcommerceLeftNavMenu } from '../../helpers'

describe('Lefthand menu store links', function () {
  describe('CoachCare Store', function () {
    it('CoachCare store link is not shown for patient', function () {
      setupEcommerceLeftNavMenu('ccr', true, 'client')

      cy.get('app-menu', {
        timeout: 12000
      })
        .find('app-sidenav-item')
        .not('.hidden')
        .as('menuLinks')

      cy.get('@menuLinks').eq(4).should('contain', 'Profile & Settings')
      cy.get('@menuLinks').eq(5).should('contain', 'Store')
      cy.get('@menuLinks').eq(6).should('contain', 'Resources')
      cy.get('@menuLinks').eq(5).click()
      cy.get('@open').should(
        'not.have.been.calledWith',
        'https://store.coachcare.com/'
      )
    })
    // })
    describe('Clinic Store', function () {
      it('Clinic store link resolves properly', function () {
        setupEcommerceLeftNavMenu('ccr', true, 'client')

        cy.get('app-menu', {
          timeout: 12000
        })
          .find('app-sidenav-item')
          .not('.hidden')
          .as('menuLinks')

        cy.get('@menuLinks').eq(5).should('contain', 'Store')
        cy.get('@menuLinks').eq(5).click()
        cy.get('@open').should(
          'have.been.calledWith',
          `http://localhost:4200/storefront?baseOrg=1`
        )
      })
      it('Clinic store link for STORE_CLINIC_USES_SHOPIFY overrides storeUrl', function () {
        setupEcommerceLeftNavMenu('musclewise', true, 'client')

        cy.get('app-menu', {
          timeout: 12000
        })
          .find('app-sidenav-item')
          .not('.hidden')
          .as('menuLinks')

        cy.get('@menuLinks').eq(5).click()
        cy.get('@open').should(
          'have.been.calledWith',
          `https://shopifyspecialstore.com`
        )
      })
      it('Use custom link text for clinic link', function () {
        setupEcommerceLeftNavMenu('musclewise', true, 'client')

        cy.get('app-menu', {
          timeout: 12000
        })
          .find('app-sidenav-item')
          .not('.hidden')
          .as('menuLinks')

        cy.get('@menuLinks').eq(5).should('contain', 'Manage My Subscription')
      })
      it('Clinic store link not shown when storeUrl is not set and STORE_CLINIC_USES_SHOPIFY not set', function () {
        setupEcommerceLeftNavMenu('ccr', false, 'client')

        cy.get('app-menu', {
          timeout: 12000
        })
          .find('app-sidenav-item')
          .not('.hidden')
          .as('menuLinks')

        cy.get('@menuLinks').eq(4).should('contain', 'Profile & Settings')
        cy.get('@menuLinks').eq(5).should('contain', 'Resources')
      })
    })
  })
})
