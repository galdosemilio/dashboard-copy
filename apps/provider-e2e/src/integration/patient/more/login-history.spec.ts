import { standardSetup } from '../../../support';

describe('Patient profile -> more -> login history', function () {
  it('Shows the login history elements in AET', function () {
    cy.setTimezone('aet');
    standardSetup();
    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings;s=login-history`);

    cy.get('mat-table', { timeout: 20000 });
    cy.get('mat-row').as('loginHistoryRows');

    cy.get('@loginHistoryRows').should('have.length', 10);

    cy.get('@loginHistoryRows')
      .eq(0)
      .should('contain', 'Saturday Aug 15, 2020')
      .should('contain', '2:37am')
      .should('contain', 'LeanMD (ID 3381)');

    cy.get('@loginHistoryRows')
      .eq(1)
      .should('contain', 'Saturday Aug 15, 2020')
      .should('contain', '2:34am')
      .should('contain', 'LeanMD (ID 3381)');

    cy.get('@loginHistoryRows')
      .eq(2)
      .should('contain', 'Saturday Aug 15, 2020')
      .should('contain', '2:32am')
      .should('contain', 'LeanMD (ID 3381)');

    cy.get('@loginHistoryRows')
      .eq(3)
      .should('contain', 'Saturday Aug 15, 2020')
      .should('contain', '2:30am')
      .should('contain', 'LeanMD (ID 3381)');

    cy.get('@loginHistoryRows')
      .eq(4)
      .should('contain', 'Saturday Aug 15, 2020')
      .should('contain', '12:45am')
      .should('contain', 'Scheduling Test 1 (ID 7444)');

    cy.get('@loginHistoryRows')
      .eq(5)
      .should('contain', 'Friday Aug 14, 2020')
      .should('contain', '10:59pm')
      .should('contain', 'Scheduling Test 1 (ID 7444)');

    cy.get('@loginHistoryRows')
      .eq(6)
      .should('contain', 'Friday Aug 14, 2020')
      .should('contain', '5:46am')
      .should('contain', 'LeanMD (ID 3381)');

    cy.get('@loginHistoryRows')
      .eq(7)
      .should('contain', 'Friday Aug 14, 2020')
      .should('contain', '5:44am')
      .should('contain', 'LeanMD (ID 3381)');

    cy.get('@loginHistoryRows')
      .eq(8)
      .should('contain', 'Friday Aug 14, 2020')
      .should('contain', '5:35am')
      .should('contain', 'LeanMD (ID 3381)');

    cy.get('@loginHistoryRows')
      .eq(9)
      .should('contain', 'Friday Aug 14, 2020')
      .should('contain', '5:11am')
      .should('contain', 'LeanMD (ID 3381)');
  });

  it('Shows the login history elements in ET', function () {
    cy.setTimezone('et');
    standardSetup();
    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings;s=login-history`);

    cy.get('mat-table', { timeout: 20000 });
    cy.get('mat-row').as('loginHistoryRows');

    cy.get('@loginHistoryRows').should('have.length', 10);

    cy.get('@loginHistoryRows')
      .eq(0)
      .should('contain', 'Friday Aug 14, 2020')
      .should('contain', '12:37pm')
      .should('contain', 'LeanMD (ID 3381)');

    cy.get('@loginHistoryRows')
      .eq(1)
      .should('contain', 'Friday Aug 14, 2020')
      .should('contain', '12:34pm')
      .should('contain', 'LeanMD (ID 3381)');

    cy.get('@loginHistoryRows')
      .eq(2)
      .should('contain', 'Friday Aug 14, 2020')
      .should('contain', '12:32pm')
      .should('contain', 'LeanMD (ID 3381)');

    cy.get('@loginHistoryRows')
      .eq(3)
      .should('contain', 'Friday Aug 14, 2020')
      .should('contain', '12:30pm')
      .should('contain', 'LeanMD (ID 3381)');

    cy.get('@loginHistoryRows')
      .eq(4)
      .should('contain', 'Friday Aug 14, 2020')
      .should('contain', '10:45am')
      .should('contain', 'Scheduling Test 1 (ID 7444)');

    cy.get('@loginHistoryRows')
      .eq(5)
      .should('contain', 'Friday Aug 14, 2020')
      .should('contain', '8:59am')
      .should('contain', 'Scheduling Test 1 (ID 7444)');

    cy.get('@loginHistoryRows')
      .eq(6)
      .should('contain', 'Thursday Aug 13, 2020')
      .should('contain', '3:46pm')
      .should('contain', 'LeanMD (ID 3381)');

    cy.get('@loginHistoryRows')
      .eq(7)
      .should('contain', 'Thursday Aug 13, 2020')
      .should('contain', '3:44pm')
      .should('contain', 'LeanMD (ID 3381)');

    cy.get('@loginHistoryRows')
      .eq(8)
      .should('contain', 'Thursday Aug 13, 2020')
      .should('contain', '3:35pm')
      .should('contain', 'LeanMD (ID 3381)');

    cy.get('@loginHistoryRows')
      .eq(9)
      .should('contain', 'Thursday Aug 13, 2020')
      .should('contain', '3:11pm')
      .should('contain', 'LeanMD (ID 3381)');
  });
});
