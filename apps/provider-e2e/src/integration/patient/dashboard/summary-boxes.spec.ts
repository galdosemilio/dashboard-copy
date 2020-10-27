import { standardSetup } from './../../../support';

describe('Patient profile -> dashboard -> summary boxes', function () {
  before(() => {
    cy.setTimezone('aet');
    standardSetup();
  });

  it('Summary boxes show data properly', function () {
    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`);

    cy.get('.ccr-dashboard', {
      timeout: 12000
    })
      .find('ccr-stat-diff')
      .as('summaryBoxes');
    cy.get('@summaryBoxes').should('have.length', 5);
    cy.get('@summaryBoxes')
      .eq(0)
      .should('contain', 'Starting: 181.0')
      .should('contain', 'Current: 185.0');
    cy.get('@summaryBoxes')
      .eq(1)
      .should('contain', 'Starting: 29.9')
      .should('contain', 'Current: 37.0');
    cy.get('@summaryBoxes')
      .eq(2)
      .should('contain', 'Starting: 151.1')
      .should('contain', 'Current: 148.0');
    cy.get('@summaryBoxes')
      .eq(3)
      .should('contain', 'Starting: 110.2')
      .should('contain', 'Current: 114.7');
    cy.get('@summaryBoxes')
      .eq(4)
      .should('contain', 'Starting: 23.0')
      .should('contain', 'Current: 19.0');
  });
});
