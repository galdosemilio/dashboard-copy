import { standardSetup } from './../../../../support'

describe('Nickelled guide automatically displays', function () {
  it('No localstorage value for RPM guide viewing - guide', function () {
    cy.setTimezone('et')
    standardSetup({ enableGuides: true })

    cy.visit(`/reports/rpm/billing`)

    cy.get('[data-cy="nickelledGuideContainer"]').should('exist')
    cy.wait(3000)
  })
  it('Localstorage set for having viewed RPM guide - no guide', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/reports/rpm/billing`)

    cy.get('[data-cy="nickelledGuideContainer"]').should('not.exist')
    cy.wait(3000)
  })
})
