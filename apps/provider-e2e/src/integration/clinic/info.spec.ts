import { standardSetup } from '../../support';

describe('Clinics -> Clinic -> Info', function () {
  it('Properly displays the Clinic Information', function () {
    standardSetup();

    cy.visit(`/accounts/clinics/${Cypress.env('clinicId')}`);

    cy.get('app-clinic-info')
      .find('input[placeholder="Name"]')
      .should('have.value', 'CoachCare');

    cy.get('app-clinic-info')
      .find('input[placeholder="First Name"]')
      .should('have.value', 'Test Clinic');

    cy.get('app-clinic-info')
      .find('input[placeholder="Last Name"]')
      .should('have.value', 'Contact');

    cy.get('app-clinic-info')
      .find('input[placeholder="Email"]')
      .should('have.value', 'test.clinic@coachcare.com');

    cy.get('app-clinic-info')
      .find('input[placeholder="Phone"]')
      .should('have.value', '1878989123');

    cy.get('app-clinic-info')
      .find('input[placeholder="Street"]')
      .should('have.value', '122 Av');

    cy.get('app-clinic-info')
      .find('input[placeholder="City"]')
      .should('have.value', 'New York');

    cy.get('app-clinic-info')
      .find('input[placeholder="State"]')
      .should('have.value', 'TX');

    cy.get('app-clinic-info')
      .find('input[placeholder="Postal Code"]')
      .should('have.value', '10001');

    cy.get('app-clinic-info')
      .find('input[placeholder="Country"]')
      .should('have.value', 'US');
  });
});
