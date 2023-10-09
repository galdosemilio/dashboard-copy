import { standardSetup } from '../../../../support'
import { assertTableRow } from '../../../helpers'
import {
  assertContentCopyRequest,
  attemptFollowFormLink,
  attemptOpenFormPreviewDialog,
  cloneContent,
  goToNextStep,
  openBatchCloningModal,
  openSingleCloningModal,
  selectAvailability,
  selectContentInModal,
  waitForModalTable
} from './utils'

describe('Dashboard -> Digital Library', function () {
  it('Shows Content Listing data in Eastern Time (New York)', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/library/content`)

    cy.get('.ccr-edit-table').find('mat-row').as('contentRows')

    cy.get('@contentRows').should('have.length', 6)

    cy.get('@contentRows')
      .eq(0)
      .should('contain', 'Test form')
      .should('contain', 'Test description')
      .should('contain', 'Mon, Dec 30 2019')
      .should('contain', 'Public')

    cy.get('@contentRows')
      .eq(1)
      .should('contain', 'Public URL')
      .should('contain', 'Test description')
      .should('contain', 'Tue, Dec 31 2019')
      .should('contain', 'Public')

    cy.get('@contentRows')
      .eq(2)
      .should('contain', 'Private folder')
      .should('contain', 'Test description')
      .should('contain', 'Wed, Jan 1 2020')
      .should('contain', 'Private')

    cy.get('@contentRows')
      .eq(3)
      .should('contain', 'Public URL 1 (local org)')
      .should('contain', 'Test description')
      .should('contain', 'Tue, Dec 31 2019')
      .should('contain', 'Public')

    cy.get('@contentRows')
      .eq(4)
      .should('contain', 'Public URL 2 (local org)')
      .should('contain', 'Test description')
      .should('contain', 'Tue, Dec 31 2019')
      .should('contain', 'Public')

    cy.get('@contentRows')
      .eq(5)
      .should('contain', 'Public URL 3 (local org)')
      .should('contain', 'Test description')
      .should('contain', 'Tue, Dec 31 2019')
      .should('contain', 'Public')
  })

  it('Shows Content Listing data in Eastern Time (Australia)', function () {
    cy.setTimezone('aet')
    standardSetup()

    cy.visit(`/library/content`)

    cy.get('.ccr-edit-table').find('mat-row').as('contentRows')

    cy.get('@contentRows').should('have.length', 6)

    assertTableRow(cy.get('@contentRows').eq(0), [
      'Test form',
      'Test description',
      'Mon, Dec 30 2019',
      'Public'
    ])

    assertTableRow(cy.get('@contentRows').eq(1), [
      'Public URL',
      'Test description',
      'Wed, Jan 1 2020',
      'Public'
    ])

    assertTableRow(cy.get('@contentRows').eq(2), [
      'Private folder',
      'Test description',
      'Wed, Jan 1 2020',
      'Private'
    ])

    assertTableRow(cy.get('@contentRows').eq(3), [
      'Public URL 1 (local org)',
      'Test description',
      'Wed, Jan 1 2020',
      'Public'
    ])

    assertTableRow(cy.get('@contentRows').eq(4), [
      'Public URL 2 (local org)',
      'Test description',
      'Wed, Jan 1 2020',
      'Public'
    ])

    assertTableRow(cy.get('@contentRows').eq(5), [
      'Public URL 3 (local org)',
      'Test description',
      'Wed, Jan 1 2020',
      'Public'
    ])
  })

  it('Close "Add Content" modal with ESC key', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/library/content`)

    cy.get('app-content')
      .find('button')
      .contains('Add Content')
      .trigger('click')

    cy.get('mat-dialog-container')
      .contains('Select content type')
      .should('have.length', 1)

    cy.get('body').type('{esc}')

    cy.get('mat-dialog-container')
      .contains('Are you sure you want to stop')
      .should('have.length', 1)
  })

  it('Allows cloning a single content', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/library/content`)

    openSingleCloningModal(0)
    waitForModalTable()
    goToNextStep()
    goToNextStep()
    selectAvailability('Public')

    cy.get('mat-dialog-container')
      .find('.mat-select-trigger')
      .trigger('click', { force: true })
      .wait(500)

    cy.get('.mat-option').eq(0).trigger('click')
    cy.tick(1000)

    goToNextStep()
    cloneContent()

    assertContentCopyRequest({ id: '1992', mode: 'public', organization: '1' })

    cy.wait(3000)
  })

  it('Allows cloning a batch of contents', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/library/content`)

    openBatchCloningModal()
    waitForModalTable()
    selectContentInModal(0)
    selectContentInModal(1)
    selectContentInModal(2)
    goToNextStep()
    goToNextStep()
    selectAvailability('Public')

    cy.get('mat-dialog-container')
      .find('.mat-select-trigger')
      .trigger('click', { force: true })
      .wait(500)

    cy.get('.mat-option').eq(0).trigger('click')
    cy.tick(1000)

    goToNextStep()

    cloneContent()

    assertContentCopyRequest({ id: '1992', mode: 'public', organization: '1' })
    assertContentCopyRequest({ id: '1877', mode: 'public', organization: '1' })
    assertContentCopyRequest({ id: '1715', mode: 'public', organization: '1' })

    cy.wait(3000)
  })

  it('Shows errors if the dry-run fails and allows cloning', function () {
    cy.setTimezone('et')
    standardSetup({
      apiOverrides: [
        {
          url: `/1.0/content/copy/${Cypress.env('firstContentItemId')}/dry-run`,
          fixture: 'api/library/dry-run-first-failed'
        },
        {
          url: `/1.0/content/copy/${Cypress.env(
            'secondContentItemId'
          )}/dry-run`,
          fixture: 'api/library/dry-run-second-failed'
        }
      ]
    })

    cy.visit(`/library/content`)

    openBatchCloningModal()
    waitForModalTable()
    selectContentInModal(0)
    selectContentInModal(1)
    selectContentInModal(2)
    goToNextStep()
    goToNextStep()
    selectAvailability('Public')

    cy.get('mat-dialog-container')
      .find('.mat-select-trigger')
      .trigger('click', { force: true })
      .wait(500)

    cy.get('.mat-option').eq(0).trigger('click')
    cy.tick(1000)

    goToNextStep()

    cloneContent()

    cy.tick(1000)

    cy.get('mat-dialog-container').should(
      'contain',
      'Related form is not accessible'
    )

    cy.get('mat-dialog-container').find('button').contains('Continue').click()

    assertContentCopyRequest({ id: '1715', mode: 'public', organization: '1' })

    cy.wait(3000)
  })

  it('Should prevent cloning if all the contents on the dry-run fail', function () {
    cy.setTimezone('et')
    standardSetup({
      apiOverrides: [
        {
          url: `/1.0/content/copy/${Cypress.env('firstContentItemId')}/dry-run`,
          fixture: 'api/library/dry-run-first-failed'
        }
      ]
    })

    cy.visit(`/library/content`)

    openBatchCloningModal()
    waitForModalTable()
    selectContentInModal(0)
    goToNextStep()
    goToNextStep()
    selectAvailability('Public')

    cy.get('mat-dialog-container')
      .find('.mat-select-trigger')
      .trigger('click', { force: true })
      .wait(500)

    cy.get('.mat-option').eq(0).trigger('click')
    cy.tick(1000)

    goToNextStep()

    cloneContent()

    cy.tick(1000)

    cy.get('mat-dialog-container').should(
      'contain',
      'Related form is not accessible'
    )

    cy.get('mat-dialog-container')
      .find('button')
      .contains('Continue')
      .parent()
      .should('be.disabled')
  })

  it('Allows opening the preview of a form', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/library/content`)

    attemptOpenFormPreviewDialog(0)

    cy.get('.mat-dialog-content')
      .should('contain', '1020')
      .should('contain', 'Test Short Answer')
  })

  it('Allows navigating to the Form page', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/library/content`)

    attemptFollowFormLink(0)

    cy.url().should('contain', '/library/forms/10161')
  })

  describe('Edit Content', () => {
    it('Should update to private', () =>
      editContentTest({
        index: 0,
        selector: 'Private',
        isPublic: false
      }))

    it('Should update to public', () =>
      editContentTest({
        index: 4,
        selector: 'Public',
        isPublic: true
      }))

    it('Should update to by phase', () =>
      editContentTest({
        index: 0,
        selector: 'By Phase',
        isPublic: false
      }))
  })
})

function editContentTest({
  index,
  selector,
  isPublic
}: {
  index: number
  selector: 'Public' | 'Private' | 'By Phase'
  isPublic: boolean
}) {
  cy.setTimezone('et')
  standardSetup()

  cy.visit(`/library/content`)

  cy.get('.ccr-edit-table').find('mat-row').as('contentRows')
  cy.get('@contentRows')
    .eq(index)
    .find('mat-icon[data-mat-icon-name="fa-edit"]')
    .click()
  cy.tick(1000)

  cy.get('mat-dialog-container')
    .get('mat-radio-group')
    .find('mat-radio-button')
    .contains(selector)
    .click()

  if (selector === 'By Phase') {
    cy.get('mat-dialog-container')
      .find('app-content-package-table')
      .find('mat-table')
      .find('mat-row')
      .eq(0)
      .find('mat-cell')
      .eq(0)
      .click()

    cy.get('app-content-package-select-dialog')
      .find('button')
      .contains('Save')
      .click()
    cy.tick(1000)
  }

  cy.get('mat-dialog-container')
    .get('mat-dialog-actions')
    .find('button')
    .contains('Save')
    .click()

  cy.tick(1000)

  cy.wait('@updateContentRequest').should((xhr) => {
    expect(xhr.request.body.isPublic).to.equal(isPublic)
  })

  if (selector === 'By Phase') {
    cy.wait('@updateContentPackageRequest').should((xhr) => {
      expect(xhr.response.statusCode).to.equal(204)
    })
  }
}
