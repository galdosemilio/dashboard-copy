import { standardSetup } from '../../../../support'

describe('Reports -> Device', function () {
  it('should display the device report', function () {
    standardSetup()
    cy.visit('/reports/device')
    cy.get('table').find('tbody').as('reportTable')
    cy.tick(10000)
    cy.get('@reportTable').get('tr').eq(0).as('firstRow')
    const firstRowData = [
      'open_in_new',
      '1',
      'John',
      'Doe',
      '1',
      'test1',
      '10/10/2023',
      'Transtek scale'
    ]
    firstRowData.forEach((td, index) => {
      cy.get('@firstRow').get('td').eq(index).should('contain', td)
    })
  })
})
