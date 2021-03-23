import { standardSetup } from '../../../support'

interface EmailTemplateFormValues {
  category: string
  html: string
  locale: string
  operation: string
  subject: string
  text: string
}

function setEmailTemplateFormValues(values: EmailTemplateFormValues) {
  cy.get('mat-dialog-container')
    .find('input[data-placeholder="Locale"]')
    .clear()
    .type(values.locale)

  cy.get('mat-dialog-container')
    .find('div.mat-select-trigger')
    .eq(0)
    .trigger('click', { force: true })
  cy.tick(1000)
  cy.get('mat-option')
    .contains(values.operation)
    .trigger('click', { force: true })
  cy.tick(1000)

  cy.get('mat-dialog-container')
    .find('div.mat-select-trigger')
    .eq(1)
    .trigger('click', { force: true })
  cy.tick(1000)
  cy.get('mat-option')
    .contains(values.category)
    .trigger('click', { force: true })
  cy.tick(1000)

  cy.get('mat-dialog-container')
    .find('input[data-placeholder="Subject"]')
    .clear()
    .type(values.subject)

  cy.get('mat-dialog-container')
    .find('textarea[data-placeholder="HTML"]')
    .clear()
    .type(values.html)

  cy.get('mat-dialog-container')
    .find('textarea[data-placeholder="Text"]')
    .clear()
    .type(values.text)
}

describe('Clinic Email Templates', function () {
  beforeEach(() => {
    cy.setTimezone('et')
    standardSetup(true)

    cy.visit(
      `/admin/organizations/${Cypress.env('organizationId')}/email-template`
    )

    cy.tick(10000)
  })

  it('Properly shows the existing email templates', function () {
    cy.get('mat-table').find('mat-row').as('emailTemplateRows')

    cy.get('@emailTemplateRows').should('have.length', 3)
    cy.get('@emailTemplateRows')
      .eq(0)
      .should('contain', '1')
      .should('contain', '3378')
      .should('contain', 'en')
      .should('contain', 'new-account')
      .should('contain', 'client')

    cy.get('@emailTemplateRows')
      .eq(1)
      .should('contain', '2')
      .should('contain', '3378')
      .should('contain', 'en')
      .should('contain', 'new-account')
      .should('contain', 'other')

    cy.get('@emailTemplateRows')
      .eq(2)
      .should('contain', '3')
      .should('contain', '2')
      .should('contain', '*')
      .should('contain', 'en')
      .should('contain', 'internal-registration')
      .should('contain', 'other')

    cy.get('p.footnotes').should('exist')
  })

  it('Allows admins to create an email template', function () {
    cy.get('ccr-organizations-email-template')
      .find('a')
      .contains('Create')
      .click({ force: true })

    setEmailTemplateFormValues({
      category: 'Other',
      html: 'testHTML',
      locale: 'testlocale',
      operation: 'Internal Registration',
      subject: 'testsubject',
      text: 'testtext'
    })

    cy.tick(1000)

    cy.get('mat-dialog-container')
      .find('button')
      .contains('Save')
      .click({ force: true })
    cy.tick(1000)

    cy.wait('@organizationTemplatePostRequest').should((xhr) => {
      expect(xhr.request.body.locale).to.equal('testlocale')
      expect(xhr.request.body.operation).to.equal('internal-registration')
      expect(xhr.request.body.category).to.equal('other')
      expect(xhr.request.body.subject).to.equal('testsubject')
      expect(xhr.request.body.html).to.equal('testHTML')
      expect(xhr.request.body.text).to.equal('testtext')
    })

    cy.wait(2000)
  })

  it('Allows admins to delete a local email template', function () {
    cy.get('mat-table').find('mat-row').as('emailTemplateRows')

    cy.get('@emailTemplateRows')
      .eq(0)
      .find('mat-icon')
      .eq(1)
      .click({ force: true })
    cy.tick(1000)

    cy.get('mat-dialog-container')
      .find('button')
      .contains('Yes')
      .click({ force: true })

    cy.wait('@organizationTemplateDeleteRequest').should((xhr) => {
      expect(xhr.request.url).to.contain('id=1')
    })

    cy.wait(2000)
  })

  it('Allows admins to edit a local email template', function () {
    cy.get('mat-table').find('mat-row').as('emailTemplateRows')

    cy.get('@emailTemplateRows')
      .eq(0)
      .find('mat-icon')
      .eq(0)
      .click({ force: true })
    cy.tick(1000)

    setEmailTemplateFormValues({
      category: 'Other',
      html: 'testHTML',
      locale: 'testlocale',
      operation: 'Internal Registration',
      subject: 'testsubject',
      text: 'testtext'
    })

    cy.get('mat-dialog-container')
      .find('button')
      .contains('Save')
      .click({ force: true })

    cy.wait('@organizationTemplatePatchRequest').should((xhr) => {
      expect(xhr.request.url).to.contain('1')
      expect(xhr.request.body.locale).to.equal('testlocale')
      expect(xhr.request.body.operation).to.equal('internal-registration')
      expect(xhr.request.body.category).to.equal('other')
      expect(xhr.request.body.subject).to.equal('testsubject')
      expect(xhr.request.body.html).to.equal('testHTML')
      expect(xhr.request.body.text).to.equal('testtext')
    })

    cy.wait(2000)
  })

  it('Prevents users from editing/deleting an inherited email template', function () {
    cy.get('mat-table').find('mat-row').as('emailTemplateRows')

    cy.get('@emailTemplateRows')
      .eq(2)
      .find('mat-icon')
      .eq(0)
      .should('have.class', 'disabled')
    cy.get('@emailTemplateRows')
      .eq(2)
      .find('mat-icon')
      .eq(1)
      .should('have.class', 'disabled')
  })
})
