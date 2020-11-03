import { standardSetup } from './../../support';

describe('Nickelled guide automatically displays', function () {
  it('Account less than 6 days old - guide', function () {
    cy.setTimezone('et');
    standardSetup(Date.UTC(2015, 1, 12), [], true);

    cy.visit('/');
    cy.wait(5000);

    cy.get('[data-cy="nickelledGuideContainer"]').should('exist');
    cy.wait(3000);
  });
  it('Account more than 6 days old - no guide', function () {
    cy.setTimezone('et');
    standardSetup(Date.UTC(2015, 1, 19), [], true);

    cy.visit('/');
    cy.wait(5000);

    cy.get('[data-cy="nickelledGuideContainer"]').should('not.exist');
    cy.wait(3000);
  });
  it('Account less than 6 days old but localstorage set - no guide', function () {
    cy.setTimezone('et');
    standardSetup(Date.UTC(2015, 1, 12), []);

    cy.visit('/');
    cy.wait(5000);

    cy.get('[data-cy="nickelledGuideContainer"]').should('not.exist');
    cy.wait(3000);
  });
});
