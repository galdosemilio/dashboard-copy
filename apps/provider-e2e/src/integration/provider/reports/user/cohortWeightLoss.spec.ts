import { standardSetup } from '../../../../support'

function filterByFirstPackage() {
  cy.get('ccr-package-filter').find('button').click()
  cy.tick(1000)

  cy.get('div.mat-menu-panel')
    .find('mat-checkbox')
    .as('packageFilterCheckboxes')

  cy.get('@packageFilterCheckboxes').eq(0).click()
  cy.tick(1000)

  cy.get('div.mat-menu-panel')
    .find('div.action-button-container')
    .find('button')
    .contains('Filter')
    .click()
  cy.tick(1000)
}

describe('Reports -> User Statistics -> Cohorts', function () {
  beforeEach(() => {
    cy.setOrganization('idealyou')
    standardSetup()

    cy.visit('/reports/statistics/cohort')

    cy.get('app-cohort-weight-loss')
  })

  it('Properly displays the Weight Cohorts Report filter', function () {
    cy.get('app-cohort-weight-loss')
    cy.get('ccr-package-filter').find('button').click()
    cy.tick(1000)

    cy.get('div.mat-menu-panel').should('not.contain', 'Phases')
    cy.get('div.mat-menu-panel')
      .find('div.action-button-container')
      .find('button')
      .should('contain', 'Filter')
  })

  it('The Weight Cohorts Report filter only allows selecting one package', function () {
    cy.get('ccr-package-filter').find('button').click()
    cy.tick(1000)

    cy.get('div.mat-menu-panel')
      .find('mat-checkbox')
      .as('packageFilterCheckboxes')

    cy.get('@packageFilterCheckboxes').eq(0).click()
    cy.tick(1000)

    cy.get('@packageFilterCheckboxes').eq(1).click()
    cy.tick(1000)

    cy.get('@packageFilterCheckboxes').eq(2).click()
    cy.tick(1000)

    cy.get('@packageFilterCheckboxes')
      .find('input[type="checkbox"]:checked')
      .should('have.length', 1)
  })

  it('Filtering by a package triggers a fetch with that package as parameter', function () {
    cy.wait('@getCohortListingRequest')

    filterByFirstPackage()

    cy.wait('@getCohortListingRequest').should((xhr) => {
      expect(xhr.request.url).to.contain('package=1')
    })
  })

  it('Filtering by a package triggers a fetch with that package as parameter (CSV)', function () {
    cy.wait('@getCohortListingRequest')

    filterByFirstPackage()

    cy.wait('@getCohortListingRequest')

    cy.get('div.ccr-htools').find('button').contains('Export CSV').click()
    cy.tick(1000)

    cy.wait('@getCohortListingRequest').should((xhr) => {
      expect(xhr.request.url).to.contain('package=1')
    })
  })

  it('CSV downloads are properly named if filtered', function () {
    filterByFirstPackage()

    cy.get('div.ccr-htools').find('button').contains('Export CSV').click()
    cy.tick(1000)

    cy.readFile(
      `${Cypress.config(
        'downloadsFolder'
      )}/Patient_Cohort_Weight_Loss_Report_Phase_Package_1.csv`
    ).should('exist')
  })

  it('CSV downloads are left as-is if not filtered', function () {
    cy.get('div.ccr-htools').find('button').contains('Export CSV').click()
    cy.tick(1000)

    cy.readFile(
      `${Cypress.config(
        'downloadsFolder'
      )}/Patient_Cohort_Weight_Loss_Report.csv`
    ).should('exist')
  })
})
