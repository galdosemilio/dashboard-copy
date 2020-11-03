import { standardSetup } from '../../../support';

describe('Dashboard -> Patients -> Patient -> Journal -> Hydration', function() {
  it('Shows Hydration data in Eastern Time (New York)', function() {
    cy.setTimezone('et');
    standardSetup();

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/journal;s=water`);

    cy.get('table', { timeout: 12000 })
      .find('tbody tr')
      .as('hydrationRows');

    cy.get('@hydrationRows').should('have.length', 7);

    cy.get('@hydrationRows')
      .eq(3)
      .should('contain', 'Sat, Dec 28')
      .should('contain', '12.0oz')
      .should('contain', '12%');

    cy.get('@hydrationRows')
      .eq(4)
      .should('contain', 'Sun, Dec 29')
      .should('contain', '8.0oz')
      .should('contain', '8%');

    cy.get('@hydrationRows')
      .eq(5)
      .should('contain', 'Mon, Dec 30')
      .should('contain', '16.0oz')
      .should('contain', '17%');

    cy.get('@hydrationRows')
      .eq(6)
      .should('contain', 'Tue, Dec 31')
      .should('contain', '59.9oz')
      .should('contain', '62%');
  });

  it('Shows Hydration data in Eastern Time (Australia)', function() {
    cy.setTimezone('aet');
    standardSetup();

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/journal;s=water`);

    cy.get('table', { timeout: 12000 })
      .find('tbody tr')
      .as('hydrationRows');

    cy.get('@hydrationRows').should('have.length', 7);

    cy.get('@hydrationRows')
      .eq(3)
      .should('contain', 'Sat, Dec 28')
      .should('contain', '12.0oz')
      .should('contain', '12%');

    cy.get('@hydrationRows')
      .eq(4)
      .should('contain', 'Sun, Dec 29')
      .should('contain', '8.0oz')
      .should('contain', '8%');

    cy.get('@hydrationRows')
      .eq(5)
      .should('contain', 'Mon, Dec 30')
      .should('contain', '16.0oz')
      .should('contain', '17%');

    cy.get('@hydrationRows')
      .eq(6)
      .should('contain', 'Tue, Dec 31')
      .should('contain', '59.9oz')
      .should('contain', '62%');
  });
});
