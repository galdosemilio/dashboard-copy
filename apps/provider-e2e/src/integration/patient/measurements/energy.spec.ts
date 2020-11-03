import { standardSetup } from './../../../support';

describe('Patient profile -> measurement -> energy', function() {
  it('Table shows step and sleep data in ET (New York)', function() {
    cy.setTimezone('et');
    standardSetup();

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/measurements;s=energy`);

    cy.get('app-dieter-measurements-table')
      .find('tbody tr')
      .as('measurementRows');

    cy.clock().tick(100000);

    cy.get('@measurementRows').should('have.length', 7);
    cy.get('@measurementRows')
      .eq(6)
      .should('contain', 'Jan 1, 2020')
      .should('contain', '50');
    cy.get('@measurementRows')
      .eq(5)
      .should('contain', 'Dec 31, 2019');
    cy.get('@measurementRows')
      .eq(4)
      .should('contain', 'Dec 30, 2019')
      .should('contain', '0.3 hrs')
      .should('contain', '12%');
    cy.get('@measurementRows')
      .eq(3)
      .should('contain', 'Dec 29, 2019');
    cy.get('@measurementRows')
      .eq(1)
      .should('contain', 'Dec 27, 2019')
      .should('contain', '1 hrs')
      .should('contain', '50%');
    cy.get('@measurementRows')
      .eq(0)
      .should('contain', 'Dec 26, 2019')
      .should('contain', '20');
  });

  it('Add step data in ET (New York) for today', function() {
    cy.setTimezone('et');
    standardSetup();

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/measurements;s=energy`);

    cy.get('add-rightpanel-measurements')
      .find('mat-radio-button')
      .contains('Energy')
      .click();

    cy.get('add-rightpanel-measurements')
      .find('input[placeholder="Steps"]')
      .type('1500');

    cy.route({
      method: 'POST',
      url: `/1.0/measurement/activity`,
      onRequest: xhr => {
        expect(xhr.request.body.activity[0].date).to.contain('2019-12-31T19:0');
        expect(xhr.request.body.activity[0].date).to.contain('-05:00');
        expect(xhr.request.body.activity[0].steps).to.contain('1500');
        expect(xhr.request.body.activity[0].device).to.contain('3');
        expect(xhr.request.body.clientId).to.contain('3');
      },
      status: 200,
      response: {}
    });

    cy.get('add-rightpanel-measurements')
      .find('a')
      .contains('Add Measurement')
      .click();
  });

  it('Add sleep data in ET (New York) for today', function() {
    cy.setTimezone('et');
    standardSetup();

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/measurements;s=energy`);

    cy.get('add-rightpanel-measurements')
      .find('mat-radio-button')
      .contains('Energy')
      .click();

    cy.get('add-rightpanel-measurements')
      .find('mat-datepicker-toggle')
      .eq(1)
      .click();

    cy.get('.mat-calendar-footer')
      .find('button')
      .contains('OK')
      .click();

    cy.route({
      method: 'POST',
      url: `/1.0/measurement/sleep`,
      onRequest: xhr => {
        const firstSleepRecord = xhr.request.body.sleep[0][0];
        const lastSleepRecord = xhr.request.body.sleep[0][31];

        expect(xhr.request.body.clientId).to.contain('3');
        expect(xhr.request.body.deviceId).to.equal(3);
        expect(xhr.request.body.sleep[0].length).to.equal(32);
        expect(firstSleepRecord.quality).to.equal(64);
        expect(firstSleepRecord.time).to.contain('2019-12-31T19:00');
        expect(firstSleepRecord.time).to.contain('-05:00');
        expect(lastSleepRecord.quality).to.equal(64);
        expect(lastSleepRecord.time).to.contain('2020-01-01T02:45');
        expect(lastSleepRecord.time).to.contain('-05:00');
      },
      status: 200,
      response: {}
    });

    cy.get('add-rightpanel-measurements')
      .find('a')
      .contains('Add Measurement')
      .click();
  });

  it('Add step data in AET (Australia Eastern) for today', function() {
    cy.setTimezone('aet');
    standardSetup();

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/measurements;s=energy`);

    cy.get('add-rightpanel-measurements')
      .find('mat-radio-button')
      .contains('Energy')
      .click();

    cy.get('add-rightpanel-measurements')
      .find('input[placeholder="Steps"]')
      .type('1500');

    cy.route({
      method: 'POST',
      url: `/1.0/measurement/activity`,
      onRequest: xhr => {
        expect(xhr.request.body.activity[0].date).to.contain('2020-01-01T11:0');
        expect(xhr.request.body.activity[0].date).to.contain('+11:00');
        expect(xhr.request.body.activity[0].steps).to.contain('1500');
        expect(xhr.request.body.activity[0].device).to.contain('3');
        expect(xhr.request.body.clientId).to.contain('3');
      },
      status: 200,
      response: {}
    });

    cy.get('add-rightpanel-measurements')
      .find('a')
      .contains('Add Measurement')
      .click();
  });

  it('Add sleep data in AET (Australia Eastern) for today', function() {
    cy.setTimezone('aet');
    standardSetup();

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/measurements;s=energy`);

    cy.get('add-rightpanel-measurements')
      .find('mat-radio-button')
      .contains('Energy')
      .click();

    cy.get('add-rightpanel-measurements')
      .find('mat-datepicker-toggle')
      .eq(1)
      .click();

    cy.get('.mat-calendar-footer')
      .find('button')
      .contains('OK')
      .click();

    cy.route({
      method: 'POST',
      url: `/1.0/measurement/sleep`,
      onRequest: xhr => {
        const firstSleepRecord = xhr.request.body.sleep[0][0];
        const lastSleepRecord = xhr.request.body.sleep[0][31];

        expect(xhr.request.body.clientId).to.contain('3');
        expect(xhr.request.body.deviceId).to.equal(3);
        expect(xhr.request.body.sleep[0].length).to.equal(32);
        expect(firstSleepRecord.quality).to.equal(64);
        expect(firstSleepRecord.time).to.contain('2020-01-01T11:00');
        expect(firstSleepRecord.time).to.contain('+11:00');
        expect(lastSleepRecord.quality).to.equal(64);
        expect(lastSleepRecord.time).to.contain('2020-01-01T18:45');
        expect(lastSleepRecord.time).to.contain('+11:00');
      },
      status: 200,
      response: {}
    });

    cy.get('add-rightpanel-measurements')
      .find('a')
      .contains('Add Measurement')
      .click();
  });

  it('Only numbers are allowed in number-only steps field', function() {
    cy.setTimezone('et');
    standardSetup();

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/measurements;s=energy`);

    cy.get('add-rightpanel-measurements')
      .find('mat-radio-group mat-radio-button')
      .eq(2)
      .click('left');

    cy.get('add-rightpanel-measurements')
      .find('[formcontrolname="steps"]')
      .type('abcdef185regoihwefloihwefoih')
      .should('have.value', '185')
      .type('.1')
      .should('have.value', '1851');
  });
});
