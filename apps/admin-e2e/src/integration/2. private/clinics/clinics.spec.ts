import { standardSetup } from '../../../support';

describe('Clinic Listing Page', () => {
  beforeEach(() => {
    cy.setTimezone('et');
    standardSetup(true);
  });

  it('Clinic Listing', () => {
    cy.visit('/admin/organizations');

    cy.get('ccr-organizations-list', { timeout: 10000 })
      .find('mat-row')
      .as('organizationRows');

    cy.get('@organizationRows').should('have.length', 3);

    cy.get('@organizationRows')
      .eq(0)
      .should('contain', '3378')
      .should('contain', '0000 Test IP Clinic (SD)');

    cy.get('@organizationRows')
      .eq(1)
      .should('contain', '44')
      .should('contain', '0005 - Pharmasave #005 /Pharmasave');

    cy.get('@organizationRows')
      .eq(2)
      .should('contain', '4036')
      .should('contain', '000 AA Org');
  });

  it('Clinic Deletion', () => {
    cy.visit('/admin/organizations');

    cy.get('button.mat-icon-button', { timeout: 10000 })
      .eq(1)
      .click();

    cy.get('button.mat-raised-button', { timeout: 10000 })
      .eq(0)
      .click();

    cy.get('simple-snack-bar', { timeout: 10000 }).should('contain', 'Clinic deactivated');
  });

  it('Clinic Edition', () => {
    cy.visit('/admin/organizations');

    cy.get('ccr-organizations-list', { timeout: 10000 });

    cy.get('button.mat-icon-button', { timeout: 10000 })
      .eq(0)
      .click();

    cy.get('button.ccr-icon-button', { timeout: 10000 })
      .eq(0)
      .click();

    cy.get('simple-snack-bar', { timeout: 10000 }).should('contain', 'Clinic updated');
  });
});
