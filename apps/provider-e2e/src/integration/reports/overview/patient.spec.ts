import { standardSetup } from '../../../support';

describe('Reports -> Overview -> Patient Signups', function() {
  it('Shows "Last 7 Days" as default timeframe option', function() {
    cy.setTimezone('et');
    standardSetup();

    cy.visit(`/reports/overview/signups`);
    cy.get('app-quick-date-range').should('contain', 'Last 7 Days');
  });
});
