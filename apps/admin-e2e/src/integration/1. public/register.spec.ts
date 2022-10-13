import { standardSetup } from '../../support'

function assessDisplayedPlan(args: {
  name: string
  price: number | string
  extras?: string[]
}) {
  cy.get('ccr-register-clinic-default-clinic-packages')
    .find('.mat-select-trigger')
    .eq(0)
    .trigger('click', { force: true })
    .wait(500)

  cy.tick(1000)

  cy.get('mat-option').contains(args.name).click({ force: true })

  cy.get(`div.item-list`).contains(args.price)
}

function completeClinicPlans(
  args: {
    plan: string
  } = { plan: 'Virtual Health' }
) {
  cy.get('ccr-register-clinic-default-clinic-packages')
    .find('.mat-select-trigger')
    .eq(0)
    .trigger('click', { force: true })
    .wait(500)

  cy.tick(1000)

  cy.get('mat-option').contains(args.plan).click({ force: true })

  cy.tick(1000)

  cy.get('button').contains('Continue').click({ force: true })
}

function completeStep0() {
  cy.get('div.option-block').as('optionBlocks')

  cy.get('@optionBlocks').should('have.length', 2)
  cy.get('@optionBlocks').eq(0).click({ force: true })
  cy.tick(1000)

  cy.get('button').contains('Continue').click({ force: true })
  cy.tick(1000)
}

function completeStep1(opts = { usesNewsletter: true }) {
  cy.get('ccr-register-clinic-default-header-title').contains(
    "LET'S BUILD YOUR CoachCare PLATFORM"
  )

  cy.get('input[data-placeholder="Clinic Name"]').type('Test Clinic')
  cy.get('input[data-placeholder="Street Address"]').type(
    '150 West 28th Street'
  )
  cy.get('input[data-placeholder="City"]').type('New York')
  cy.get('input[data-placeholder="State"]').type('New York')
  cy.get('input[data-placeholder="Postal Code"]').type('10001')
  cy.get('ccr-form-field-country').trigger('click').wait(800)
  cy.get('.cdk-overlay-container')
    .find('mat-option')
    .contains('United States')
    .trigger('click')
    .wait(800)
  cy.tick(1000)
  cy.get('input[data-placeholder="First Name"]').type('Eric')
  cy.get('input[data-placeholder="Last Name"]').type('Di Bari')
  cy.get('input[data-placeholder="Email Address"]').type('eric@coachcare.com')
  cy.get('input[data-placeholder="Phone Number"]').type('5188948256')
  cy.get('ccr-form-field-consent')
    .find('[type="checkbox"]')
    .check({ force: true })

  if (opts.usesNewsletter) {
    cy.get('.newsletter-checkbox')
      .find('[type="checkbox"]')
      .check({ force: true })
  }

  cy.get('button').contains('Continue').trigger('click', { force: true })

  cy.wait(2000)
}

function completeCreditCard(cardNumber: string) {
  cy.get('iframe').then(($iframe) => {
    const $doc = $iframe.contents()

    cy.wrap($doc.find('input[placeholder="1234 1234 1234 1234"]'))
      .click()
      .type(cardNumber)

    cy.wrap($doc.find('input[placeholder="MM / YY"]'))
      .click()
      .type('10')
      .type('24')

    cy.wrap($doc.find('input[placeholder="CVC"]')).click().type('424')
  })
}

const cards = [
  {
    number: '424242424242424242',
    description: 'Visa'
  }
]

const plans = [
  {
    param: 'virtualHealth',
    title: 'Virtual Health'
  },
  {
    param: 'remoteMonitoring',
    title: 'Remote Monitoring'
  },
  {
    param: 'healthSystem',
    title: 'Health System'
  }
]

describe('Register New Clinic', function () {
  beforeEach(() => {
    cy.clearCookies()
    cy.setTimezone('et')
    standardSetup(false)

    cy.intercept('HEAD', '2.0/account?**', {
      statusCode: 404,
      body: {}
    })

    cy.intercept('POST', '3.0/ccr/register', (request) => {
      expect(request.body.account.firstName).to.contain('Eric')
      expect(request.body.account.lastName).to.contain('Di Bari')
      expect(request.body.account.email).to.contain('eric@coachcare.com')
      expect(request.body.account.phone).to.contain('5188948256')
      expect(request.body.account.timezone).to.contain('America/New_York')
      expect(request.body.organization.contact.firstName).to.contain('Eric')
      expect(request.body.organization.contact.lastName).to.contain('Di Bari')
      expect(request.body.organization.contact.email).to.contain(
        'eric@coachcare.com'
      )
      expect(request.body.organization.contact.phone).to.contain('5188948256')
      expect(request.body.organization.address.street).to.contain(
        '150 West 28th Street'
      )
      expect(request.body.organization.address.city).to.contain('New York')
      expect(request.body.organization.address.state).to.contain('New York')
      expect(request.body.organization.address.postalCode).to.contain('10001')
      expect(request.body.organization.address.country).to.contain('US')

      if (request.body.plan) {
        expect(request.body.plan.type).to.equal('virtualHealth')
        expect(request.body.organization.parentOrganizationId).to.equal('7412')
      }

      request.reply({})
    })
  })

  for (const plan of plans) {
    it(`Allows plan to be set from the URL: ${plan.param} and hide plan step`, function () {
      cy.visit(`/register/clinic?plan=${plan.param}`)

      cy.get('mat-horizontal-stepper')
        .find('mat-step-header')
        .should('have.length', 3)
      completeStep1()

      cy.get('ccr-page-register-clinic-payment')
        .find('#payment-form')
        .contains('Billing Information')
    })
  }

  it('Register without credit card [redirect]', function () {
    cy.visit(`/register/clinic?creditCard=skip`)
    completeStep1()
    completeClinicPlans()

    cy.url().should('contain', 'ccr-clinic-registration-successful')
  })

  it('Register without credit card [no redirect]', function () {
    cy.setOrgCookie('31')

    cy.visit(`/register/clinic?baseOrg=31&creditCard=skip`)
    completeStep1({ usesNewsletter: false })

    cy.get('ccr-page-register-clinic-default-last-step')
      .contains('All Done!')
      .should('be.visible')
  })

  it('Register and skip optional credit card [redirect]', function () {
    cy.visit(`/register/clinic?creditCard=optional`)
    completeStep1()
    completeClinicPlans()
    cy.get('ccr-page-register-clinic-payment')
      .find('button')
      .contains('Skip')
      .trigger('click')

    cy.url().should('contain', 'ccr-clinic-registration-successful')
  })

  it('Register and skip optional credit card [no redirect]', function () {
    cy.setOrgCookie('31')

    cy.visit(`/register/clinic?baseOrg=31&creditCard=optional`)
    completeStep1({ usesNewsletter: false })

    cy.get('ccr-page-register-clinic-payment')
      .find('button')
      .contains('Skip')
      .trigger('click')

    cy.get('ccr-page-register-clinic-default-last-step')
      .contains('All Done!')
      .should('be.visible')
  })

  it('Register and complete optional credit card (Visa) [redirect]', function () {
    cy.visit(`/register/clinic?creditCard=optional`)
    completeStep1()
    completeClinicPlans()
    completeCreditCard(cards[0].number)

    cy.get('ccr-page-register-clinic-payment')
      .find('[type="checkbox"]')
      .check({ force: true })

    cy.get('ccr-page-register-clinic-payment')
      .find('button')
      .contains('Continue')
      .trigger('click')

    cy.url().should('contain', 'ccr-clinic-registration-successful')
  })

  it('Register and complete optional credit card (Visa) [no redirect]', function () {
    cy.setOrgCookie('31')

    cy.visit(`/register/clinic?baseOrg=31&creditCard=optional`)
    completeStep1({ usesNewsletter: false })

    completeCreditCard(cards[0].number)

    cy.get('ccr-page-register-clinic-payment')
      .find('[type="checkbox"]')
      .check({ force: true })

    cy.get('ccr-page-register-clinic-payment')
      .find('button')
      .contains('Continue')
      .trigger('click')

    cy.get('ccr-page-register-clinic-default-last-step')
      .contains('All Done!')
      .should('be.visible')
  })

  for (const card of cards) {
    it(`Register and complete with required credit card (${card.description}) [redirect]`, function () {
      cy.visit(`/register/clinic`)
      completeStep1()
      completeClinicPlans()

      completeCreditCard(card.number)

      cy.get('ccr-page-register-clinic-payment')
        .find('[type="checkbox"]')
        .check({ force: true })

      cy.get('ccr-page-register-clinic-payment')
        .find('button')
        .contains('Continue')
        .trigger('click')

      cy.url().should('contain', 'ccr-clinic-registration-successful')
    })

    it(`Register and complete with required credit card (${card.description}) [no redirect]`, function () {
      cy.setOrgCookie('31')

      cy.visit(`/register/clinic?baseOrg=31`)
      completeStep1({ usesNewsletter: false })

      completeCreditCard(card.number)

      cy.get('ccr-page-register-clinic-payment')
        .find('[type="checkbox"]')
        .check({ force: true })

      cy.get('ccr-page-register-clinic-payment')
        .find('button')
        .contains('Continue')
        .trigger('click')

      cy.get('ccr-page-register-clinic-default-last-step')
        .contains('All Done!')
        .should('be.visible')
    })
  }

  it('Registers with mobile app selection', function () {
    cy.setOrgCookie('7016')
    cy.visit(`/register/clinic?baseOrg=7016`)

    completeStep0()
    completeStep1({ usesNewsletter: false })

    completeCreditCard(cards[0].number)

    cy.get('ccr-page-register-clinic-payment')
      .find('[type="checkbox"]')
      .check({ force: true })

    cy.get('ccr-page-register-clinic-payment')
      .find('button')
      .contains('Continue')
      .trigger('click')

    cy.get('ccr-page-register-clinic-default-last-step')
      .contains('All Done!')
      .should('be.visible')
  })

  it('Properly displays clinic plan data', function () {
    cy.visit(`/register/clinic`)

    completeStep1()

    cy.tick(1000)
    cy.wait(1000)

    assessDisplayedPlan({
      name: 'Virtual Health',
      price: 'Request Order Form for pricing and terms'
    })

    assessDisplayedPlan({
      name: 'Virtual Health',
      price: 'Request Order Form for pricing and terms'
    })

    assessDisplayedPlan({
      name: 'Remote Monitoring',
      price: 'Request Order Form for pricing and terms'
    })

    assessDisplayedPlan({
      name: 'Remote Monitoring',
      price: 'Request Order Form for pricing and terms'
    })

    assessDisplayedPlan({
      name: 'Health System',
      price: 'Request Order Form for pricing and terms'
    })

    assessDisplayedPlan({
      name: 'Health System',
      price: 'Request Order Form for pricing and terms'
    })
  })
})
