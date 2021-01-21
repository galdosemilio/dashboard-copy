import { standardSetup } from '../../../support'
import {
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
      .should('contain', 'Wed, Jan 1 2020')
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
      .should('contain', 'Wed, Jan 1 2020')
      .should('contain', 'Public')

    cy.get('@contentRows')
      .eq(4)
      .should('contain', 'Public URL 2 (local org)')
      .should('contain', 'Test description')
      .should('contain', 'Wed, Jan 1 2020')
      .should('contain', 'Public')

    cy.get('@contentRows')
      .eq(5)
      .should('contain', 'Public URL 3 (local org)')
      .should('contain', 'Test description')
      .should('contain', 'Wed, Jan 1 2020')
      .should('contain', 'Public')
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

    cy.wait('@contentCopyRequest').should((xhr) => {
      expect(xhr.request.body.id).to.equal('1992')
      expect(xhr.request.body.mode).to.equal('public')
      expect(xhr.request.body.organization).to.equal('1')
    })

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

    cy.wait('@contentCopyRequest').should((xhr) => {
      expect(xhr.request.body.id).to.equal('1992')
      expect(xhr.request.body.mode).to.equal('public')
      expect(xhr.request.body.organization).to.equal('1')
    })

    cy.wait('@contentCopyRequest').should((xhr) => {
      expect(xhr.request.body.id).to.equal('1877')
      expect(xhr.request.body.mode).to.equal('public')
      expect(xhr.request.body.organization).to.equal('1')
    })

    cy.wait('@contentCopyRequest').should((xhr) => {
      expect(xhr.request.body.id).to.equal('1715')
      expect(xhr.request.body.mode).to.equal('public')
      expect(xhr.request.body.organization).to.equal('1')
    })

    cy.wait(3000)
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
})
