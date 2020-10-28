export function createClinic(data: any) {
  cy.get('.mat-button').contains('Add New Clinic').click({ force: true });
  cy.tick(1000);

  cy.get('input[data-placeholder="Name"]').type(data.name);
  cy.get('input[data-placeholder="First Name"]').type(data.contact.firstName);
  cy.get('input[data-placeholder="Last Name"]').type(data.contact.lastName);
  cy.get('input[data-placeholder="Email"]').type(data.contact.email);
  cy.get('input[data-placeholder="Phone"]').type(data.contact.phone);
  cy.get('input[data-placeholder="Street"]').type(data.address.street);
  cy.get('input[data-placeholder="City"]').type(data.address.city);
  cy.get('input[data-placeholder="State"]').type(data.address.state);
  cy.get('input[data-placeholder="Postal Code"]').type(data.address.postalCode);

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
