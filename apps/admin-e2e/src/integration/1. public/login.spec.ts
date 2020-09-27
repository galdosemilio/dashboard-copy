import { standardSetup } from '../../support';

describe('Load login page', function() {
  beforeEach(() => {
    cy.setTimezone('et');
    standardSetup(false);
  });

  it('Register new company link shows', function() {
    cy.visit(`/`);
    cy.get('a')
      .contains('Register a new Company')
      .should('have.length', 1);
  });

  it('Register new company link is hidden', function() {
    cy.visit(`/?hideRegisterCompany=tru`);
    cy.get('a')
      .contains('Register a new Company')
      .should('have.length', 1);
  });

  it('Register new company link is hidden', function() {
    cy.visit(`/?hideRegisterCompany=true`);
    cy.get('a')
      .contains('Register a new Company')
      .should('have.length', 0);
  });
});
