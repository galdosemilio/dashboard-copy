import { standardSetup } from '../../support'
import {
  attemptBulkEnrollPatients,
  attemptEnrollPatients,
  selectAutocompleteOption,
  selectEnrollmentStep
} from './utils'

describe('Sequence -> View -> Enrollments', function () {
  // it('Properly enrolls a bunch of patients', function () {
  //   cy.setTimezone('et');
  //   standardSetup();

  //   cy.visit(`/sequences/sequence/${Cypress.env('sequenceId')}`);

  //   cy.tick(10000);

  //   cy.get('[data-cy="sequence-button-enrollees"]').click();
  //   cy.get('[data-cy="sequence-enroll"]').click();

  //   cy.get('ccr-user-search').find('input').type('Test');
  //   cy.tick(10000);
  //   selectAutocompleteOption(0);

  //   cy.get('ccr-user-search').find('input').type('Test');
  //   cy.tick(10000);
  //   selectAutocompleteOption(1);

  //   attemptEnrollPatients();

  //   cy.wait('@sequenceBulkEnrollmentPostRequest').should((xhr) => {
  //     expect(xhr.request.body.accounts.toString()).to.equal(['1', '3'].toString());
  //     expect(xhr.request.body.organization).to.equal('1');
  //     expect(xhr.request.body.sequence).to.equal(`${Cypress.env('sequenceId')}`);
  //     expect(xhr.request.body.executeAt.local).to.equal('2020-01-01T00:00:00');
  //     expect(xhr.request.body.transition).to.equal('1674');
  //     expect(xhr.request.body.createdBy).to.equal(1);
  //   });

  //   cy.wait(2000);
  // });

  // it('Properly enrolls a bunch of patients mid-sequence', function () {
  //   cy.setTimezone('et');
  //   standardSetup();

  //   cy.visit(`/sequences/sequence/${Cypress.env('sequenceId')}`);

  //   cy.tick(10000);

  //   cy.get('[data-cy="sequence-button-enrollees"]').click();
  //   cy.get('[data-cy="sequence-enroll"]').click();

  //   cy.get('ccr-user-search').find('input').type('Test');
  //   cy.tick(10000);
  //   cy.wait(1000);
  //   selectAutocompleteOption(0);

  //   cy.get('ccr-user-search').find('input').type('Test');
  //   cy.tick(10000);
  //   cy.wait(1000);
  //   selectAutocompleteOption(0);

  //   selectEnrollmentStep(3);

  //   attemptEnrollPatients();

  //   cy.wait('@sequenceBulkEnrollmentPostRequest').should((xhr) => {
  //     expect(xhr.request.body.accounts.toString()).to.equal(['1', '3'].toString());
  //     expect(xhr.request.body.organization).to.equal('1');
  //     expect(xhr.request.body.sequence).to.equal(`${Cypress.env('sequenceId')}`);
  //     expect(xhr.request.body.executeAt.local).to.equal('2020-01-03T03:00:00');
  //     expect(xhr.request.body.transition).to.equal('1836');
  //     expect(xhr.request.body.createdBy).to.equal(1);
  //   });

  //   cy.wait(2000);
  // });

  it('Properly enrolls all the patients in a clinic', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/sequences/sequence/${Cypress.env('sequenceId')}`)

    cy.tick(10000)

    cy.get('[data-cy="sequence-button-enrollees"]').click()
    cy.get('[data-cy="sequence-enroll"]').click()

    cy.get('mat-dialog-container')
      .contains('All patients in clinic')
      .click({ force: true })

    cy.tick(1000)
    cy.wait(1000)

    cy.get('ccr-organization-search')
      .find('input')
      .type('Test', { force: true })
    cy.tick(100000)

    selectAutocompleteOption(0)

    attemptBulkEnrollPatients()

    cy.wait('@sequenceBulkOrganizationEnrollmentPostRequest').should((xhr) => {
      expect(xhr.request.body.organization).to.equal('1')
      expect(xhr.request.body.sequence).to.equal(`${Cypress.env('sequenceId')}`)
      expect(xhr.request.body.executeAt.local).to.equal('2020-01-01T00:00:00')
      expect(xhr.request.body.transition).to.equal('1674')
    })

    cy.wait(2000)
  })

  it('Properly enrolls all the patients in a clinic mid-sequence', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/sequences/sequence/${Cypress.env('sequenceId')}`)

    cy.tick(10000)

    cy.get('[data-cy="sequence-button-enrollees"]').click()
    cy.get('[data-cy="sequence-enroll"]').click()

    cy.get('mat-dialog-container')
      .contains('All patients in clinic')
      .click({ force: true })

    cy.tick(1000)
    cy.wait(1000)

    selectEnrollmentStep(3)

    cy.get('ccr-organization-search')
      .find('input')
      .type('Test', { force: true })
    cy.tick(100000)

    selectAutocompleteOption(0)

    attemptBulkEnrollPatients()

    cy.wait('@sequenceBulkOrganizationEnrollmentPostRequest').should((xhr) => {
      expect(xhr.request.body.organization).to.equal('1')
      expect(xhr.request.body.sequence).to.equal(`${Cypress.env('sequenceId')}`)
      expect(xhr.request.body.executeAt.local).to.equal('2020-01-03T03:00:00')
      expect(xhr.request.body.transition).to.equal('1836')
    })

    cy.wait(2000)
  })
})
