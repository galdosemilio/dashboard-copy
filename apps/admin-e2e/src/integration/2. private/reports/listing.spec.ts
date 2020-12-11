import { standardSetup } from '../../../support'

describe('Reports > Overview > Inactive Clinic Listing', () => {
  beforeEach(() => {
    cy.setTimezone('et')
    standardSetup(true)
  })

  it('All Reports Are Listed', () => {
    cy.visit(`/admin/reports`)
    cy.get('[data-cy="report-listing"]').should(
      'contain',
      'Inactive Clinics Report'
    )
  })
})
