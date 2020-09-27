import { standardSetup } from '../../../support';

describe('Coach Listing Page', () => {
  beforeEach(() => {
    cy.setTimezone('et');
    standardSetup();
  });

  it('Coach Listing', () => {
    cy.visit('/admin/accounts/coaches');

    cy.get('ccr-accounts-table', { timeout: 10000 })
      .find('mat-row')
      .as('coachRows');

    cy.get('@coachRows').should('have.length', 3);

    cy.get('@coachRows')
      .eq(0)
      .should('contain', '5606')
      .should('contain', '1030 232323')
      .should('contain', '232323_sss@grr.la');

    cy.get('@coachRows')
      .eq(1)
      .should('contain', '5608')
      .should('contain', '1048 dsdsd')
      .should('contain', 'sdsds@grr.la');

    cy.get('@coachRows')
      .eq(2)
      .should('contain', '6777')
      .should('contain', '11111111111aaaaakajnsdkajnkjnd askdjnakjnajd')
      .should('contain', 'dkansdkjasnd@gmail.com');
  });

  it('Coach Deletion', () => {
    cy.visit('/admin/accounts/coaches');

    cy.get('ccr-accounts-table', { timeout: 10000 });

    cy.get('button.mat-icon-button', { timeout: 10000 })
      .eq(1)
      .click();

    cy.get('button.ccr-button', { timeout: 10000 })
      .eq(0)
      .click();

    cy.get('simple-snack-bar', { timeout: 10000 }).should('contain', 'Account deactivated');
  });

  it('Coach Edition', () => {
    cy.visit('/admin/accounts/coaches');

    cy.get('ccr-accounts-table', { timeout: 10000 });

    cy.get('button.mat-icon-button', { timeout: 10000 })
      .eq(0)
      .click();

    cy.get('button.ccr-icon-button', { timeout: 10000 })
      .eq(0)
      .click();

    cy.get('simple-snack-bar', { timeout: 10000 }).should('contain', 'Account updated');
  });
});
