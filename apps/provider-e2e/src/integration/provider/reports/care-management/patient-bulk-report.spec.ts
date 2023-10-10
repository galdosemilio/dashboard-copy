import { standardSetup } from '../../../../support'

describe('Reports -> Care Management -> Patient Bulk Reports', function () {
  beforeEach(() => {
    cy.setTimezone('et')
    standardSetup()
    cy.visit(`/reports/rpm/patient-bulk-reports`)
  })

  it('should load data successfully', function () {
    cy.wait('@task')
    cy.get('app-patient-bulk-reports').find('table').as('table')
    cy.get('@table').find('tbody tr').should('have.length', 1)
    cy.get('@table').find('tbody tr').first().as('row')
    cy.get('@row').find('td').as('columns')
    cy.get('@columns').eq(0).should('contain', '1')
    cy.get('@columns').eq(1).should('contain', 'Succeeded')
    cy.get('@columns').eq(2).should('contain', 'RPM Monthly')
  })
})
