import { standardSetup } from '../support'
import { ValidOrganization } from '../support/organizations'

export function assertElement(element, contains: string[]): void {
  contains.forEach((requiredString) =>
    element.should('contain', requiredString)
  )
}

export function assertTableRow(row, contains: string[]): void {
  contains.forEach((requiredString) => row.should('contain', requiredString))
}

export function selectOption(selectorElement, optionName: string): void {
  selectorElement
    .find('.mat-select-trigger')
    .trigger('click', { force: true })
    .wait(500)

  cy.get('.mat-option').contains(optionName).trigger('click')
  cy.tick(1000)
}

export function selectAutocompleteOption(index: number): void {
  cy.get('mat-option').eq(index).click({ force: true })

  cy.tick(5000)
}

export function setupEcommerceLeftNavMenu(
  clinic: ValidOrganization,
  clinicStore: boolean,
  accountType?: 'client' | 'provider'
) {
  cy.fixture('api/organization/getMala').then((malaFixture) => {
    cy.setOrganization(clinic)
    standardSetup({ mode: accountType ?? 'provider' })

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

export function checkList(linkName: string, menuNames: string[]) {
  cy.get(linkName).should('have.length', menuNames.length)

  for (let i = 0; i < menuNames.length; i += 1) {
    cy.get(linkName).eq(i).should('contain', menuNames[i])
  }
}
