import { standardSetup } from '../../../support'

describe('Dashboard -> Coach Own Profile', function () {
  it('View coach own profile with 5 tabs', function () {
    standardSetup()

    cy.visit(`/profile`)

    cy.get('div.ccr-tabs').find('a').as('coachMenuLinks')

    cy.get('@coachMenuLinks').should('have.length', 5)
    cy.get('@coachMenuLinks').eq(0).should('contain', ' Profile')
    cy.get('@coachMenuLinks').eq(1).should('contain', ' Addresses')
    cy.get('@coachMenuLinks').eq(2).should('contain', ' Security')
    cy.get('@coachMenuLinks').eq(3).should('contain', ' Communications')
    cy.get('@coachMenuLinks').eq(4).should('contain', ' Login History')
    cy.get('account-form')
  })

  it('Allows the user to save the coach data', function () {
    standardSetup()

    cy.visit(`/profile`)

    cy.get('div.ccr-tabs').find('a').as('coachMenuLinks')

    cy.get('@coachMenuLinks').contains('Profile').click({ force: true })

    cy.tick(1000)

    cy.get('app-profile').find('button').contains('Save').click({ force: true })

    cy.wait('@accountPatchRequest').should((xhr) => {
      expect(xhr.request.body.defaultOrganization).to.equal('1')
    })

    cy.wait('@accountPatchRequest').should((xhr) => {
      expect(xhr.request.body.id).to.equal(1)
      expect(xhr.request.body.countryCode).to.equal('+1')
      expect(xhr.request.body.email).to.equal('eric@websprout.org')
      expect(xhr.request.body.firstName).to.equal('Eric')
      expect(xhr.request.body.lastName).to.equal('Di Bari')
      expect(xhr.request.body.measurementPreference).to.equal('us')
      expect(xhr.request.body.phone).to.equal('(405) 255-7327')
      expect(xhr.request.body.preferredLocales[0]).to.equal('en')
      expect(xhr.request.body.timezone).to.equal('et')
    })
  })

  it('Should not have delete account button for coach', function () {
    standardSetup()

    cy.visit(`/profile`)

    cy.get('app-profile')
      .find('button')
      .contains('Delete Account')
      .should('not.exist')
  })

  it('Should not allow to change ip restricted email', function () {
    standardSetup()
    cy.intercept('GET', '/1.0/security/ip-restriction', {
      fixture: 'api/security/getIPWithRestriction'
    }).as('getIPRestriction')

    cy.visit(`/profile`)

    cy.get('div.ccr-tabs').find('a').as('coachMenuLinks')

    cy.get('@coachMenuLinks').contains('Profile').click({ force: true })

    cy.tick(1000)

    cy.get('app-profile')
      .find('input[formcontrolname="email"]')
      .should('have.attr', 'readonly', 'readonly')

    cy.get('mat-hint').should(
      'contain',
      'Email domain has an IP address restriction. Please contact support to change the email address.'
    )

    cy.get('app-profile').find('button').contains('Save').click({ force: true })

    cy.wait('@accountPatchRequest')
    cy.wait('@accountPatchRequest').should((xhr) => {
      expect(xhr.request.body).to.not.include({ email: 'eric@websprout.org' })
    })
  })
})
