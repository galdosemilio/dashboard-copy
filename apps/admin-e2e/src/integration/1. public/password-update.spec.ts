import { standardSetup } from '../../support'

describe('Load homepage', function () {
  beforeEach(() => {
    cy.setTimezone('et')
    standardSetup(false)
  })

  it('Shows the clinic privacy policy links for Healthy Transformation', function () {
    cy.setOrgCookie('7341')
    cy.visit(
      `/password/update?code=testcode&email=email@test.com&type=update&accountType=2&baseOrg=7341&consentRequired=true`
    )
    cy.get('ccr-form-field-consent').should(
      'contain',
      'Bariatric Advantage Privacy Policy'
    )
  })

  it('Does not the clinic privacy policy links for Healthy Transformation if another clinic is chosen', function () {
    cy.visit(
      `/password/update?code=testcode&email=email@test.com&type=update&accountType=2&baseOrg=30&consentRequired=true`
    )
    cy.get('ccr-form-field-consent').should(
      'not.contain',
      'Bariatric Advantage Privacy Policy'
    )
  })
})
