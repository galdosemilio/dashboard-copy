import { standardSetup } from '../../support';

describe('Schedule -> create meeting', function() {
  it('Can create a meeting', function() {
    cy.setTimezone('et');
    standardSetup();

    cy.visit(`/schedule/view`);

    cy.get('app-consultation')
      .find('input[placeholder="Title"]')
      .type('meeting title');

    cy.route({
      method: 'POST',
      url: `/2.0/meeting`,
      onRequest: xhr => {
        expect(xhr.request.body.title).to.contain('meeting title');
        expect(xhr.request.body.location.streetAddress).to.contain(
          '150 West 28th Street'
        );
        expect(xhr.request.body.location.city).to.contain('New York');
        expect(xhr.request.body.location.postalCode).to.contain('10001');
        expect(xhr.request.body.location.state).to.contain('NY');
        expect(xhr.request.body.location.country).to.contain('US');
        expect(xhr.request.body.timezone).to.equal('America/New_York');
        expect(xhr.request.body.startTime).to.equal('2019-12-31T19:15:00-05:00');
        expect(xhr.request.body.endTime).to.equal('2019-12-31T19:30:00-05:00');
      },
      status: 200,
      response: {}
    });

    cy.get('app-consultation')
      .find('a')
      .contains('Save Meeting')
      .trigger('click');
  });
});
