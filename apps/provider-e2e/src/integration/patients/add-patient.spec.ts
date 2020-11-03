import { standardSetup } from '../../support';

describe('Patients -> Add Patient -> Select packages', function () {
  beforeEach(() => {
    cy.setTimezone('et');
    standardSetup();
  });

  it('Allows a provider to create a patient account', function () {
    cy.visit(`/accounts/patients`);
    cy.get('dieter-listing-with-phi').find('a').contains('Add New Patient').click();

    cy.get('mat-dialog-container')
      .find('input[placeholder="First Name"]')
      .type('test first name');

    cy.get('mat-dialog-container')
      .find('input[placeholder="Last Name"]')
      .type('test last name');

    cy.get('mat-dialog-container')
      .find('input[placeholder="Email"]')
      .type('test@test.com');

    cy.get('mat-dialog-container').find('input[placeholder="Phone"]').type('1111111');

    cy.get('mat-dialog-container')
      .find('input[placeholder="Date of Birth"]')
      .eq(1)
      .type('1/1/2000');

    cy.get('mat-dialog-container')
      .find('div.mat-select-trigger')
      .eq(1)
      .click({ force: true });
    cy.tick(1000);

    cy.get('mat-option').contains('Male').click({ force: true });
    cy.tick(1000);

    cy.get('mat-dialog-container')
      .find('div.mat-select-trigger')
      .eq(2)
      .click({ force: true });
    cy.tick(1000);

    cy.get('mat-option').contains('6').click({ force: true });
    cy.tick(1000);

    cy.get('mat-dialog-container')
      .find('div.mat-select-trigger')
      .eq(3)
      .click({ force: true });
    cy.tick(1000);

    cy.get('mat-option').contains('0').click({ force: true });
    cy.tick(1000);

    cy.get('mat-dialog-container')
      .find('input[placeholder="Weight Goal (Optional)"]')
      .type('200');

    cy.get('app-content-package-table').find('mat-row').as('packageRows');

    cy.get('@packageRows')
      .eq(0)
      .should('contain', 'Package 1')
      .find('mat-checkbox')
      .click();

    cy.get('mat-dialog-container')
      .find('button')
      .contains('Save New User')
      .click({ force: true });

    cy.wait('@accountPostRequest').should((xhr) => {
      expect(xhr.request.body.accountType).to.equal('3');
      expect(xhr.request.body.association.organization).to.equal('1');
      expect(xhr.request.body.client.birthday).to.equal('2000-01-01');
      expect(xhr.request.body.client.gender).to.equal('male');
      expect(xhr.request.body.client.height).to.equal(183);
      expect(xhr.request.body.countryCode).to.equal('+1');
      expect(xhr.request.body.email).to.equal('test@test.com');
      expect(xhr.request.body.firstName).to.equal('test first name');
      expect(xhr.request.body.hasMinimumAgeConsent).to.equal(false);
      expect(xhr.request.body.isActive).to.equal(true);
      expect(xhr.request.body.lastName).to.equal('test last name');
      expect(xhr.request.body.measurementPreference).to.equal('us');
      expect(xhr.request.body.countryCode).to.equal('+1');
      expect(xhr.request.body.packages[0].id).to.equal('1');
      expect(xhr.request.body.packages[0].organization.id).to.equal('1');
      expect(xhr.request.body.packages[0].title).to.equal('Package 1');
      expect(xhr.request.body.phone).to.equal('1111111');
      expect(xhr.request.body.preferredLocales[0]).to.equal('en');
      expect(xhr.request.body.timezone).to.equal('America/New_York');
    });

    cy.wait('@goalPutRequest').should((xhr) => {
      expect(xhr.request.body.account).to.equal('1');
      expect(xhr.request.body.goal[0].goal).to.equal('weight');
      expect(xhr.request.body.goal[0].quantity).to.equal(90718);
    });

    cy.wait(2000);
  });

  it('Packages show in add patient modal', function () {
    cy.visit(`/accounts/patients`);
    cy.get('dieter-listing-with-phi').find('a').contains('Add New Patient').click();

    cy.get('[data-cy=clientStartedAtInput]').should('have.length', 1);

    cy.get('app-content-package-table').find('mat-row').as('packageRows');

    cy.get('@packageRows').should('have.length', 3);

    cy.get('@packageRows')
      .eq(0)
      .should('contain', 'Package 1')
      .find('mat-checkbox')
      .click();
    cy.get('@packageRows').eq(1).should('contain', 'Package 2');
    cy.get('@packageRows')
      .eq(2)
      .should('contain', 'Package 3')
      .find('mat-checkbox')
      .click();
  });

  it('Shows the underage client warning', function () {
    cy.visit(`/accounts/patients`);
    cy.get('dieter-listing-with-phi').find('a').contains('Add New Patient').click();

    cy.get('[data-cy=clientStartedAtInput]').should('have.length', 1);

    cy.wait(1000);

    cy.get('[placeholder="Date of Birth"]').eq(1).click({ force: true });

    cy.tick(1000);

    cy.get('[placeholder="Date of Birth MM/DD/YYYY"]')
      .eq(0)
      .type('06/21/2019')
      .trigger('blur', { force: true });

    cy.tick(1000);

    cy.get('span').contains('I understand that this account');
  });

  it('Shows error messages if attempting to submit an empty form', function () {
    cy.visit(`/accounts/patients`);
    cy.get('dieter-listing-with-phi').find('a').contains('Add New Patient').click();

    cy.get('mat-dialog-container')
      .find('button')
      .contains('Save New User')
      .click({ force: true });
    cy.tick(1000);

    cy.get('mat-dialog-container').should('contain', 'Date of birth is required');
  });
});
