import { standardSetup } from '../../support'

describe('Patient Listing', function () {
  it('Start Date not affected by time or timezone offset (ET)', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/accounts/patients`)

    cy.get('table', { timeout: 10000 })
    cy.clock().tick(10000)

    cy.get('[data-cy="startDate"]')
      .eq(0)
      .should('contain', 'Jun 21, 2019')
      .should('contain', '(193 days)')

    cy.get('[data-cy="startDate"]')
      .eq(1)
      .should('contain', 'Jun 21, 2019')
      .should('contain', '(193 days)')
  })

  it('Start Date not affected by time or timezone offset (AET)', function () {
    cy.setTimezone('aet')
    standardSetup()

    cy.visit(`/accounts/patients`)

    cy.get('table', { timeout: 10000 })
    cy.clock().tick(10000)

    cy.get('[data-cy="startDate"]')
      .eq(0)
      .should('contain', 'Jun 21, 2019')
      .should('contain', '(194 days)')

    cy.get('[data-cy="startDate"]')
      .eq(1)
      .should('contain', 'Jun 21, 2019')
      .should('contain', '(194 days)')
  })
})
