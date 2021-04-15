import { standardSetup } from '../../support'

describe('Dashboard -> Coach Own Profile', function () {
  it('View coach own profile with 4 tabs', function () {
    standardSetup()

    cy.visit(`/profile`)

    cy.get('div.ccr-tabs').find('a').as('coachMenuLinks')

    cy.get('@coachMenuLinks').should('have.length', 4)
    cy.get('@coachMenuLinks').eq(0).should('contain', ' Profile')
    cy.get('@coachMenuLinks').eq(1).should('contain', ' Security')
    cy.get('@coachMenuLinks').eq(2).should('contain', ' Communications')
    cy.get('@coachMenuLinks').eq(3).should('contain', ' Login History')
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
})
