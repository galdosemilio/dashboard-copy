import { standardSetup } from './../../../support';

describe('Organization Messaging Preference', function() {
  it('Messaging is shown in patient profile', function() {
    cy.setOrganization('ccr');
    standardSetup();

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`);

    // Main buttons
    cy.get('.ccr-tabs')
      .find('a')
      .contains('Messages')
      .should('have.length', 1);

    cy.wait(5000);
  });

  it('Messaging is hidden in patient profile', function() {
    cy.setOrganization('ccr');
    standardSetup();

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/dashboard`);

    cy.route(
      'GET',
      '/1.0/message/preference/organization?organization=**',
      'fixture:/api/message/getOrgPreference-disabled'
    );

    // Main buttons
    cy.get('.ccr-tabs')
      .find('a')
      .contains('Messages')
      .should('have.length', 0);
  });
});
