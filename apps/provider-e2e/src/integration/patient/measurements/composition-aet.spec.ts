import { standardSetup } from './../../../support'

describe('Patient profile -> measurement -> composition (AET)', function () {
  beforeEach(() => {
    cy.setTimezone('aet')
    standardSetup()
  })

  it('Table shows weight data in AET (Australia Eastern)', function () {
    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/measurements`)

    cy.get('app-dieter-measurements-table', {
      timeout: 12000
    })
      .find('tbody tr')
      .as('measurementRows')

    cy.clock().tick(100000)

    cy.get('@measurementRows').should('have.length', 13)

    cy.get('@measurementRows').eq(11).should('contain', 'Wed Jan 1, 2020')

    cy.get('@measurementRows')
      .eq(12)
      .should('contain', '12:00 pm')
      .should('contain', '183.0 lbs')
      .should('contain', '17.0%')
      .should('contain', '47.7 %')
      .should('contain', '27934 ml')
      .should('contain', '15.0 l')
      .should('contain', '499.0 g')

    cy.get('@measurementRows').eq(9).should('contain', 'Tue Dec 31, 2019')

    cy.get('@measurementRows')
      .eq(10)
      .should('contain', '184.1 lbs')
      .should('contain', '15.0 l')
      .should('contain', '17.5%')

    cy.get('@measurementRows').eq(7).should('contain', 'Mon Dec 30, 2019')

    cy.get('@measurementRows')
      .eq(8)
      .should('contain', '2:00 pm')
      .should('contain', '185.2 lbs')
      .should('contain', '5.0 l')
      .should('contain', '18.0%')

    cy.get('@measurementRows').eq(4).should('contain', 'Sun Dec 29, 2019')

    cy.get('@measurementRows')
      .eq(5)
      .should('contain', '10:00 am')
      .should('contain', '189.6 lbs')
      .should('contain', '30.0 l')
      .should('contain', '20.0%')
    // Special case where the '00:00:00' time measurements are displayed always on the date of the recordedAt value and do NOT change based on any timezone setting
    cy.get('@measurementRows').eq(1).should('contain', 'Fri Dec 27, 2019')

    cy.get('@measurementRows')
      .eq(2)
      .should('contain', '11:00 am')
      .should('contain', '198.4 lbs')
      .should('contain', '21.0 l')
      .should('contain', '30.0%')
  })

  // We might want to set up visual assertion for these ones. Remember to discuss it with Eric -- Zcyon
  // it('Chart shows weight data in AET (Australia Eastern)', function() {
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

  it('Add composition measurement in AET (Australia Eastern)', function () {
    cy.route({
      method: 'POST',
      url: `/2.0/measurement/body`,
      onRequest: (xhr) => {
        expect(xhr.request.body.recordedAt).to.contain('+11:00')
        expect(xhr.request.body.weight).to.equal('83915')
      },
      status: 200,
      response: {}
    })
    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/measurements`)

    cy.get('add-rightpanel-measurements', {
      timeout: 12000
    })
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
  })

  it('Shows the timezone difference notice', function () {
    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/measurements`)

    cy.get('add-rightpanel-measurements')
      .find('.timezone-notice-container')
      .should('exist')

    cy.wait(2000)
  })
})
