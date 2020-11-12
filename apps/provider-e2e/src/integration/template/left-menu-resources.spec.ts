import { standardSetup } from './../../support'

describe('Lefthand menu (resources link)', function () {
  beforeEach(() => {
    cy.setOrganization('ccr')
    standardSetup()
  })

  it('By default, resource links are correct', function () {
    cy.visit('/', {
      onBeforeLoad(win) {
        cy.stub(win, 'open').as('openWindow')
      }
    })

    // Adding for Cypress issue where page continues to load after spec is done
    cy.get('app-dieters-table')

    cy.get('app-menu').find('app-sidenav-item').not('.hidden').as('menuLinks')

    cy.get('@menuLinks')
      .eq(20)
      .should('contain', 'Resources')
      .find('mat-list-item')
      .first()
      .click()

    cy.get('@menuLinks')
      .eq(21)
      .should('contain', 'Updates')
      .find('mat-list-item')
      .first()
      .click()

    cy.location().should((loc) => {
      expect(loc.pathname).to.equal('/resources/platform-updates')
    })

    cy.get('@menuLinks')
      .eq(22)
      .should('contain', 'FAQ & Support Guides')
      .find('mat-list-item')
      .first()
      .click()

    cy.get('@openWindow').should(
      'be.calledWithMatch',
      'https://coachcare.zendesk.com/hc/en-us/categories/360001031511-Coach-Provider-Dashboard'
    )

    cy.get('@menuLinks')
      .eq(23)
      .should('contain', 'Contact Support')
      .find('mat-list-item')
      .first()
      .click()

    cy.get('@openWindow').should(
      'be.calledWithMatch',
      'https://coachcare.zendesk.com/hc/en-us/requests/new'
    )
  })
})
