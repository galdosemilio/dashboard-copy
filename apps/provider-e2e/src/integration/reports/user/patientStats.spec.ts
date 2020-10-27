import { standardSetup } from '../../../support';

describe('Reports -> User Statistics -> Patient Statistics', function() {
  it('Shows "Last 7 Days" as default timeframe option', function() {
    cy.setTimezone('et');
    standardSetup();

    cy.visit(`/reports/statistics/patient`);
    cy.get('app-quick-date-range').should('contain', 'Last 7 Days');
  });
});
