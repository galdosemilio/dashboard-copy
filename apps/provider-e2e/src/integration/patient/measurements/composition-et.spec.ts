import { standardSetup } from './../../../support'

describe('Patient profile -> measurement -> composition (ET)', function () {
  beforeEach(() => {
    cy.setTimezone('et')
    standardSetup()
  })

  it('Table shows weight data in ET (New York)', function () {
    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/measurements`)

    cy.get('app-dieter-measurements-table')
      .find('tbody tr')
      .as('measurementRows')

    cy.clock().tick(100000)

    cy.get('@measurementRows').should('have.length', 13)

    cy.get('@measurementRows').eq(11).should('contain', 'Dec 31, 2019')

    cy.get('@measurementRows')
      .eq(12)
      .should('contain', '8:00 pm')
      .should('contain', '183.0 lbs')
      .should('contain', '17.0%')
      .should('contain', '47.7 %')
      .should('contain', '27934 ml')
      .should('contain', '15.0 l')
      .should('contain', '499.0 g')

    cy.get('@measurementRows').eq(9).should('contain', 'Mon Dec 30, 2019')

    cy.get('@measurementRows')
      .eq(10)
      .should('contain', '9:00 pm')
      .should('contain', '184.1 lbs')
      .should('contain', '15.0 l')
      .should('contain', '17.5%')

    cy.get('@measurementRows').eq(7).should('contain', 'Sun Dec 29, 2019')

    cy.get('@measurementRows')
      .eq(8)
      .should('contain', '10:00 pm')
      .should('contain', '185.2 lbs')
      .should('contain', '5.0 l')
      .should('contain', '18.0%')

    cy.get('@measurementRows').eq(4).should('contain', 'Sat Dec 28, 2019')

    cy.get('@measurementRows')
      .eq(5)
      .should('contain', '6:00 pm')
      .should('contain', '189.6 lbs')
      .should('contain', '30.0 l')
      .should('contain', '20.0%')

    cy.get('@measurementRows')
      .eq(2)
      .should('contain', '7:00 pm')
      .should('contain', '198.4 lbs')
      .should('contain', '21.0 l')
      .should('contain', '30.0%')

    // Special case where the '00:00:00' time measurements are displayed always on the date of the recordedAt value and do NOT change based on any timezone setting
    cy.get('@measurementRows').eq(3).should('contain', 'Fri Dec 27, 2019')
  })

  // We might want to set up visual assertion for these ones. Remember to discuss it with Eric -- Zcyon
  // it('Chart shows weight data in ET (New York)', function() {
  //   cy.visit(`/accounts/patients/${Cypress.env('clientId')}/measurements`);

  //   cy.get('a.ccr-icon-button', { timeout: 12000 })
  //     .eq(0)
  //     .click();

  //   cy.get('canvas', {
  //     timeout: 24000
  //   }).as('chart');

  //   cy.clock().tick(100000);

  //   cy.get('@chart').trigger('mouseover');
  // });

  it('Add composition measurement in ET (New York)', function () {
    cy.route({
      method: 'POST',
      url: `/2.0/measurement/body`,
      onRequest: (xhr) => {
        expect(xhr.request.body.recordedAt).to.contain('-05:00')
        expect(xhr.request.body.weight).to.equal('83915')
      },
      status: 200,
      response: {}
    })
    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/measurements`)

    cy.get('add-rightpanel-measurements')
      .find('mat-radio-group mat-radio-button')
      .as('categoryButtons')
    cy.get('@categoryButtons').should('have.length', 4)
    cy.get('@categoryButtons')
      .eq(1)
      .should('contain', 'Composition')
      .click('left')

    cy.get('add-rightpanel-measurements')
      .find('[formcontrolname="weight"]')
      .type('185')

    cy.get('add-rightpanel-measurements')
      .find('a')
      .contains('Add Measurement')
      .click()

    cy.wait(6000)
  })

  it('Hides the timezone difference notice', function () {
    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/measurements`)

    cy.get('add-rightpanel-measurements')
      .find('.timezone-notice-container')
      .should('not.exist')

    cy.wait(2000)
  })

  it('Only numbers and decimals are allowed in number-only weight field', function () {
    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/measurements`)

    cy.get('add-rightpanel-measurements')
      .find('mat-radio-group mat-radio-button')
      .eq(1)
      .click('left')

    cy.get('add-rightpanel-measurements')
      .find('[formcontrolname="weight"]')
      .type('abcdef185')
      .should('have.value', '185')
      .type('.1')
      .should('have.value', '185.1')
  })
})
