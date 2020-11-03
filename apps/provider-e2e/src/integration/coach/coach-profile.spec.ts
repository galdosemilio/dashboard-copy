import { standardSetup } from '../../support';

describe('Dashboard -> Coach Profile', function () {
  it('View coach profile with 3 tabs', function () {
    standardSetup();

    cy.visit(`/accounts/coaches/${Cypress.env('providerIdOther')}`);

    cy.get('[data-cy="coachProfileMenu"]').find('a').as('coachMenuLinks');

    cy.get('@coachMenuLinks').should('have.length', 4);
    cy.get('@coachMenuLinks').eq(0).should('contain', ' Profile');
    cy.get('@coachMenuLinks').eq(1).should('contain', ' Clinics');
    cy.get('@coachMenuLinks').eq(2).should('contain', ' Communications');
    cy.get('@coachMenuLinks').eq(3).should('contain', ' Login History');
  });
});
