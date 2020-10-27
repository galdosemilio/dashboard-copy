export function createClinic(data: any) {
  cy.get('.mat-button').contains('Add New Clinic').click({ force: true });
  cy.tick(1000);

  cy.get('input[placeholder="Name"]').type(data.name);
  cy.get('input[placeholder="First Name"]').type(data.contact.firstName);
  cy.get('input[placeholder="Last Name"]').type(data.contact.lastName);
  cy.get('input[placeholder="Email"]').type(data.contact.email);
  cy.get('input[placeholder="Phone"]').type(data.contact.phone);
  cy.get('input[placeholder="Street"]').type(data.address.street);
  cy.get('input[placeholder="City"]').type(data.address.city);
  cy.get('input[placeholder="State"]').type(data.address.state);
  cy.get('input[placeholder="Postal Code"]').type(data.address.postalCode);

  cy.tick(1000);

  cy.tick(1000);

  cy.get('mat-dialog-container')
    .find('.mat-select-trigger')
    .trigger('click', { force: true })
    .wait(500);

  cy.get('.mat-option').contains(data.address.country).trigger('click');
  cy.tick(1000);

  cy.get('button.mat-button').contains('Save Clinic').click({ force: true });
  cy.tick(1000);
}
