import { standardSetup } from '../../../support';

describe('Patient profile -> more -> submenu (standard)', function () {
  it('Correct submenu links', function () {
    cy.setOrganization('ccr');
    standardSetup();

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings`);

    cy.get('app-dieter-settings').find('li').as('menuLinks');

    cy.get('@menuLinks').should('have.length', 9);
    cy.get('@menuLinks').eq(0).should('contain', 'Profile');
    cy.get('@menuLinks').eq(1).should('contain', 'Phases');
    cy.get('@menuLinks').eq(2).should('contain', 'Devices');
    cy.get('@menuLinks').eq(3).should('contain', 'Forms');
    cy.get('@menuLinks').eq(4).should('contain', 'Sequences');
    cy.get('@menuLinks').eq(5).should('contain', 'Communications');
    cy.get('@menuLinks').eq(6).should('contain', 'Clinics');
    cy.get('@menuLinks').eq(7).should('contain', 'File Vault');
    cy.get('@menuLinks').eq(8).should('contain', 'Login History');

    cy.wait(2000);
  });

  it('Correct submenu links - exclude File Vault', function () {
    cy.setOrganization('ccr');
    standardSetup(undefined, [
      {
        url: '/1.0/content/vault/preference?organization=**',
        fixture: 'fixture:/api/filevault/getOrgPreference-disabled'
      }
    ]);

    cy.visit(`/accounts/patients/${Cypress.env('clientId')}/settings`);

    cy.get('app-dieter-settings').find('li').as('menuLinks');

    cy.get('@menuLinks').should('have.length', 8);
    cy.get('@menuLinks').eq(0).should('contain', 'Profile');
    cy.get('@menuLinks').eq(1).should('contain', 'Phases');
    cy.get('@menuLinks').eq(2).should('contain', 'Devices');
    cy.get('@menuLinks').eq(3).should('contain', 'Forms');
    cy.get('@menuLinks').eq(4).should('contain', 'Sequences');
    cy.get('@menuLinks').eq(5).should('contain', 'Communications');
    cy.get('@menuLinks').eq(6).should('contain', 'Clinics');
    cy.get('@menuLinks').eq(7).should('contain', 'Login History');

    cy.wait(2000);
  });
});
