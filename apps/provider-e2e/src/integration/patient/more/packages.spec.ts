import { standardSetup } from './../../../support';

describe('Patient profile -> more -> phases and labels', function() {
  beforeEach(() => {
    standardSetup();
  });

  it('View and select packages', function() {
    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings;s=labels`);

    cy.get('app-labels-table')
      .find('mat-row')
      .as('packageRows');

    cy.get('@packageRows').should('have.length', 3);

    cy.get('@packageRows')
      .eq(0)
      .should('contain', 'Package 1');
    cy.get('@packageRows')
      .eq(1)
      .should('contain', 'Package 2');

    cy.route({
      method: 'POST',
      url: `/1.0/package/enrollment`,
      onRequest: xhr => {
        expect(xhr.request.body.account).to.contain('3');
        expect(xhr.request.body.shortcode).to.equal('3');
      },
      status: 200,
      response: {}
    });

    cy.get('@packageRows')
      .eq(2)
      .should('contain', 'Package 3')
      .find('a')
      .click();
  });
});
