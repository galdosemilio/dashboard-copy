import { standardSetup } from '../../../support'

describe('Measurements > Data Point Types', function () {
  beforeEach(() => {
    cy.setTimezone('et')
    standardSetup(true)
  })

  it('Shows the Data Point Types', function () {
    cy.visit(`/admin/measurements/management/data-points`)

    cy.get('mat-table').find('mat-row').as('dataPointTypeRows')

    cy.get('@dataPointTypeRows')
      .eq(0)
      .should('contain', '30')
      .should('contain', 'Acetone')
    cy.get('@dataPointTypeRows')
      .eq(1)
      .should('contain', '15')
      .should('contain', 'Arm circumference')
    cy.get('@dataPointTypeRows')
      .eq(2)
      .should('contain', '10')
      .should('contain', 'Basal metabolic rate')
  })
})
