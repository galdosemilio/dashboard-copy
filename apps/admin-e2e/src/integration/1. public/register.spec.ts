import { standardSetup } from '../../support'

function assessDisplayedPlan(args: {
  billingTerm: string
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

  cy.get('ccr-register-clinic-default-clinic-packages')
    .find('.mat-select-trigger')
    .eq(1)
    .trigger('click', { force: true })
    .wait(500)

  cy.tick(1000)

  cy.get('mat-option').contains(args.billingTerm).click({ force: true })

  cy.tick(1000)

  cy.get(`div.item-list`).contains(args.price)
}

function assessSelectedPlan(plan: string) {
  cy.get('mat-select').contains(plan)
}

function assessSelectedTerm(term: string): void {
  cy.get('mat-select').should('contain', term)
}

function completeClinicPlans(
  args: {
    plan: string
    billingTerm: string
  } = { plan: 'Track', billingTerm: 'Monthly' }
) {
  cy.get('ccr-register-clinic-default-clinic-packages')
    .find('.mat-select-trigger')
    .eq(0)
    .trigger('click', { force: true })
    .wait(500)

  cy.tick(1000)

  cy.get('mat-option').contains(args.plan).click({ force: true })

  cy.tick(1000)

  cy.get('ccr-register-clinic-default-clinic-packages')
    .find('.mat-select-trigger')
    .eq(1)
    .trigger('click', { force: true })
    .wait(500)

  cy.tick(1000)

  cy.get('mat-option').contains(args.billingTerm).click({ force: true })

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
    param: 'track',
    title: 'Track'
  },
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

const billingTerms = [
  {
    param: 'monthly',
    selected: 'Monthly'
  },
  {
    param: 'annually',
    selected: 'Annual'
  },
  {
    param: 'annual',
    selected: 'Annual'
  },
  {
    param: '',
    selected: 'Annual'
  }
]

describe('Register New Clinic', function () {
  beforeEach(() => {
    cy.clearCookies()
    cy.setTimezone('et')
    standardSetup(false)

    cy.route({
      method: 'POST',
      onRequest: (xhr) => {
        expect(xhr.request.body.account.firstName).to.contain('Eric')
        expect(xhr.request.body.account.lastName).to.contain('Di Bari')
        expect(xhr.request.body.account.email).to.contain('eric@coachcare.com')
        expect(xhr.request.body.account.phone).to.contain('5188948256')
        expect(xhr.request.body.account.timezone).to.contain('America/New_York')
        expect(xhr.request.body.organization.contact.firstName).to.contain(
          'Eric'
        )
        expect(xhr.request.body.organization.contact.lastName).to.contain(
          'Di Bari'
        )
        expect(xhr.request.body.organization.contact.email).to.contain(
          'eric@coachcare.com'
        )
        expect(xhr.request.body.organization.contact.phone).to.contain(
          '5188948256'
        )
        expect(xhr.request.body.organization.address.street).to.contain(
          '150 West 28th Street'
        )
        expect(xhr.request.body.organization.address.city).to.contain(
          'New York'
        )
        expect(xhr.request.body.organization.address.state).to.contain(
          'New York'
        )
        expect(xhr.request.body.organization.address.postalCode).to.contain(
          '10001'
        )
        expect(xhr.request.body.organization.address.country).to.contain('US')

        if (xhr.request.body.plan) {
          expect(xhr.request.body.plan.billingPeriod).to.equal('monthly')
          expect(xhr.request.body.plan.type).to.equal('track')
          expect(xhr.request.body.organization.parentOrganizationId).to.equal(
            '30'
          )
        }
      },
      url: '3.0/ccr/register',
      status: 200,
      response: {}
    })
  })

  for (const plan of plans) {
    it(`Allows plan to be set from the URL: ${plan.param}`, function () {
      cy.visit(`/register/clinic?plan=${plan.param}`)

      completeStep1()

      cy.tick(1000)
      cy.wait(1000)

      assessSelectedPlan(plan.title)
    })
  }

  for (const term of billingTerms) {
    it(`Allows billing term to be set from the URL: "${term.param}"`, function () {
      cy.visit(
        term.param !== ''
          ? `/register/clinic?billingTerm=${term.param}`
          : `/register/clinic`
      )

      completeStep1()

      cy.tick(1000)
      cy.wait(1000)

      assessSelectedTerm(term.selected)
    })
  }

  it('Register without credit card', function () {
    cy.visit(`/register/clinic?creditCard=skip`)
    completeStep1()
    completeClinicPlans()
    cy.get('ccr-page-register-clinic-default-last-step').contains('All Done!')
  })

  it('Register and skip optional credit card', function () {
    cy.visit(`/register/clinic?creditCard=optional`)
    completeStep1()
    completeClinicPlans()
    cy.get('ccr-page-register-clinic-payment')
      .find('button')
      .contains('Skip')
      .trigger('click')
    cy.get('ccr-page-register-clinic-default-last-step').contains('All Done!')
  })

  it('Register and complete optional credit card (Visa)', function () {
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

    cy.get('ccr-page-register-clinic-default-last-step')
      .contains('All Done!')
      .should('be.visible')
  })

  for (const card of cards) {
    it(`Register and complete with required credit card (${card.description})`, function () {
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
      billingTerm: 'Monthly',
      name: 'Track',
      price: 150
    })

    assessDisplayedPlan({
      billingTerm: 'Annual',
      name: 'Track',
      price: 100
    })

    assessDisplayedPlan({
      billingTerm: 'Monthly',
      name: 'Virtual Health',
      price: 425
    })

    assessDisplayedPlan({
      billingTerm: 'Annual',
      name: 'Virtual Health',
      price: 350
    })

    assessDisplayedPlan({
      billingTerm: 'Monthly',
      name: 'Remote Monitoring',
      price: 'Request Order Form for pricing and terms'
    })

    assessDisplayedPlan({
      billingTerm: 'Annual',
      name: 'Remote Monitoring',
      price: 'Request Order Form for pricing and terms'
    })

    assessDisplayedPlan({
      billingTerm: 'Monthly',
      name: 'Health System',
      price: 'Request Order Form for pricing and terms'
    })

    assessDisplayedPlan({
      billingTerm: 'Annual',
      name: 'Health System',
      price: 'Request Order Form for pricing and terms'
    })
  })
})
