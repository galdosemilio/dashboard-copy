import { standardSetup } from './../../support';

describe('Lefthand menu (standard)', function () {
  beforeEach(() => {
    cy.setOrganization('ccr');
    standardSetup();
  });

  it('By default, all proper links show', function () {
    cy.visit('/');

    cy.get('app-menu', {
      timeout: 12000
    })
      .find('app-sidenav-item')
      .not('.hidden')
      .as('menuLinks');
    cy.get('@menuLinks').should('have.length', 24);
    cy.get('@menuLinks').eq(0).should('contain', 'Dashboard');
    cy.get('@menuLinks').eq(1).should('contain', 'Accounts');
    cy.get('@menuLinks').eq(2).should('contain', 'Patients');
    cy.get('@menuLinks').eq(3).should('contain', 'Coaches');
    cy.get('@menuLinks').eq(4).should('contain', 'Clinics');
    cy.get('@menuLinks').eq(5).should('contain', 'Schedule');
    cy.get('@menuLinks').eq(6).should('contain', 'List View');
    cy.get('@menuLinks').eq(7).should('contain', 'Calendar View');
    cy.get('@menuLinks').eq(8).should('contain', 'Set Availability');
    cy.get('@menuLinks').eq(9).should('contain', 'Messages');
    /* Assumes the base org has digital library enabled.  If there's an error, it's likely here... */
    cy.get('@menuLinks').eq(10).should('contain', 'Digital Library');
    cy.get('@menuLinks').eq(11).should('contain', 'Alerts');
    cy.get('@menuLinks').eq(12).should('contain', 'Notifications');
    cy.get('@menuLinks').eq(13).should('contain', 'Settings');
    cy.get('@menuLinks').eq(14).should('contain', 'Reports');
    cy.get('@menuLinks').eq(15).should('contain', 'Overview');
    cy.get('@menuLinks').eq(16).should('contain', 'User Statistics');
    cy.get('@menuLinks').eq(17).should('contain', 'Communications');
    cy.get('@menuLinks').eq(18).should('contain', 'Sequences');
    cy.get('@menuLinks').eq(19).should('contain', 'Store');
    cy.get('@menuLinks').eq(20).should('contain', 'Resources');
    cy.get('@menuLinks').eq(21).should('contain', 'Updates');
    cy.get('@menuLinks').eq(22).should('contain', 'FAQ & Support Guides');
    cy.get('@menuLinks').eq(23).should('contain', 'Contact Support');

    // Adding for Cypress issue where page continues to load after spec is done
    cy.get('app-dieters-table', {
      timeout: 12000
    });
  });
});
