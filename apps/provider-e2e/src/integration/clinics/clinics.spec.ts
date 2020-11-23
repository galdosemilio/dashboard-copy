import { standardSetup } from '../../support'
import { createClinic } from './utils'

describe('Dashboard -> Clinics', function () {
  it.only('Creates a new clinic', function () {
    cy.setOrganization('inhealth')
    standardSetup()
    cy.visit(`/accounts/clinics`)

    cy.get('mat-table', { timeout: 30000 })

    createClinic({
      address: {
        city: 'cypress_address_city',
        country: 'Canada',
        postalCode: 'cypress_address_postal_code',
        state: 'cypress_address_state',
        street: 'cypress_address_street'
      },
      contact: {
        email: 'cypress_contact_email@cypress.com',
        firstName: 'cypress_contact_firstname',
        lastName: 'cypress_contact_lastname',
        phone: '1111111'
      },
      isActive: true,
      name: 'cypress_organization_name',
      parentOrganizationId: '1'
    })

    cy.wait('@organizationCreateRequest').should((xhr) => {
      expect(xhr.request.body.parentOrganizationId).to.equal('7242')
      expect(xhr.request.body.name).to.equal('cypress_organization_name')
      expect(xhr.request.body.isActive).to.equal(true)
      expect(xhr.request.body.contact.email).to.equal(
        'cypress_contact_email@cypress.com'
      )
      expect(xhr.request.body.contact.firstName).to.equal(
        'cypress_contact_firstname'
      )
      expect(xhr.request.body.contact.lastName).to.equal(
        'cypress_contact_lastname'
      )
      expect(xhr.request.body.contact.phone).to.equal('1111111')
      expect(xhr.request.body.address.city).to.equal('cypress_address_city')
      expect(xhr.request.body.address.country).to.equal('CA')
      expect(xhr.request.body.address.postalCode).to.equal(
        'cypress_address_postal_code'
      )
      expect(xhr.request.body.address.state).to.equal('cypress_address_state')
      expect(xhr.request.body.address.street).to.equal('cypress_address_street')
    })

    cy.wait(2000)
  })

  it('Redirects you to the clinic info page on click', function () {
    cy.setOrganization('inhealth')
    standardSetup()
    cy.visit(`/accounts/clinics`)

    cy.get('mat-table', { timeout: 30000 }).find('mat-row').as('clinicRows')

    cy.get('@clinicRows').eq(0).find('mat-cell').eq(0).click({ force: true })

    cy.location().should((loc) => {
      expect(loc.href).to.equal(
        `${Cypress.env('baseUrl')}/accounts/clinics/${Cypress.env('clinicId')}`
      )
    })
  })
})
