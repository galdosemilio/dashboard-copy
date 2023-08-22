import { standardSetup } from '../../../support'

const expectedLinks = [
  'Dashboard',
  'Messages',
  'Digital Library',
  'File Vault',
  'Profile & Settings',
  'Store',
  'Resources',
  'Contact Support'
]

describe('Patient Sidenav', function () {
  it('Loads properly for a generic organization', function () {
    cy.setOrganization('ccr')
    standardSetup({ mode: 'client' })

    cy.visit('/')

    cy.get('app-menu').find('app-sidenav-item').not('.hidden').as('menuLinks')
    cy.get('@menuLinks').should('have.length', 8)

    expectedLinks.forEach((link, index) => {
      getMenuLinkToContain(index, link)
    })
  })

  it('Loads properly for MuscleWise', function () {
    cy.setOrganization('musclewise')
    standardSetup({ mode: 'client' })

    cy.visit('/')

    cy.get('app-menu').find('app-sidenav-item').not('.hidden').as('menuLinks')
    cy.get('@menuLinks').should('have.length', 8)

    expectedLinks.splice(5, 1, 'Manage My Subscription')

    expectedLinks.forEach((link, index) => {
      getMenuLinkToContain(index, link)
    })
  })
})

function getMenuLinkToContain(index, content) {
  cy.get('@menuLinks').eq(index).should('contain', content)
}
