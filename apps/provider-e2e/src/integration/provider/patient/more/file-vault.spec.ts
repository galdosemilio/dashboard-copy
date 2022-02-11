import { standardSetup } from '../../../../support'

function openFileVault() {
  cy.get('app-dieter-file-vault').should('exist')

  cy.wait(1000)
  cy.tick(1000)

  cy.get('app-dieter-file-vault')
    .find('ccr-organization-search')
    .find('input')
    .click()

  cy.tick(1000)

  cy.get('div.mat-autocomplete-panel').find('mat-option').eq(0).click()

  cy.tick(1000)
  cy.wait(1000)
  cy.tick(1000)
}

function checkExternalVisibilityColumn(assertion: 'exist' | 'not.exist'): void {
  cy.visit(
    `/accounts/patients/${Cypress.env('clientId')}/settings;s=file-vault`
  )

  openFileVault()

  cy.get('app-dieter-file-vault')
    .find('mat-table')
    .find('mat-header-cell')
    .contains('External Visibility')
    .should(assertion)
}

function checkExternalVisibilityInCreateDialog(
  assertion: 'contain' | 'not.contain'
): void {
  cy.visit(
    `/accounts/patients/${Cypress.env('clientId')}/settings;s=file-vault`
  )

  openFileVault()

  cy.get('button').contains('Add Content').click()

  cy.tick(1000)

  cy.get('mat-dialog-container').find('button').contains('File').click()

  cy.tick(1000)

  cy.get('mat-dialog-container').should(assertion, 'External Visibility')
}

function checkExternalVisibilityInEditDialog(
  assertion: 'contain' | 'not.contain',
  contentIndex: number
) {
  cy.visit(
    `/accounts/patients/${Cypress.env('clientId')}/settings;s=file-vault`
  )

  openFileVault()

  cy.get('mat-table').find('mat-row').as('vaultRows')
  cy.get('@vaultRows')
    .eq(contentIndex)
    .find('mat-icon[data-mat-icon-name="fa-edit"]')
    .click()
  cy.tick(1000)

  cy.get('mat-dialog-container').should(assertion, 'External Visibility')
}

describe('Dashboard -> Patients -> Patient -> More -> File Vault', function () {
  it('Properly shows the file vault', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(
      `/accounts/patients/${Cypress.env('clientId')}/settings;s=file-vault`
    )

    openFileVault()

    cy.get('app-dieter-file-vault').find('mat-table').should('exist')
  })

  it('Shows the External Visibility Column if the clinic requires it', function () {
    cy.setOrganization('wellcore')
    cy.setTimezone('et')
    standardSetup()

    checkExternalVisibilityColumn('exist')
  })

  it(`Hides the External Visibility Column if the clinic doesn't require it`, function () {
    cy.setOrganization('ccr')
    cy.setTimezone('et')
    standardSetup()

    checkExternalVisibilityColumn('not.exist')
  })

  it('Shows the External Visibility field in the Content Upload Dialog', function () {
    cy.setOrganization('wellcore')
    cy.setTimezone('et')
    standardSetup()

    checkExternalVisibilityInCreateDialog('contain')
  })

  it('Hides the External Visibility field in the Content Upload Dialog', function () {
    cy.setOrganization('ccr')
    cy.setTimezone('et')
    standardSetup()

    checkExternalVisibilityInCreateDialog('not.contain')
  })

  it('Shows the External Visibility field in the Content Edit Dialog (Config Set/Is File)', function () {
    cy.setOrganization('wellcore')
    cy.setTimezone('et')
    standardSetup()

    checkExternalVisibilityInEditDialog('contain', 6)
  })

  it('Hides the External Visibility field in the Content Edit Dialog (Config Set/Not File)', function () {
    cy.setOrganization('wellcore')
    cy.setTimezone('et')
    standardSetup()

    checkExternalVisibilityInEditDialog('not.contain', 5)
  })

  it('Hides the External Visibility field in the Content Edit Dialog (Config Not Set/Is File)', function () {
    cy.setOrganization('ccr')
    cy.setTimezone('et')
    standardSetup()

    checkExternalVisibilityInEditDialog('not.contain', 6)
  })
})
