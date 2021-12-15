import { standardSetup } from '../../../support'
import {
  assertSequenceBulkEnrollmentRequest,
  assertSequenceBulkOrganizationEnrollmentRequest,
  attemptBulkEnrollPatients,
  attemptEnrollPatients,
  selectAutocompleteOption,
  selectEnrollmentStep
} from './helpers'

describe('Sequence -> View -> Enrollments', function () {
  it('Properly enrolls a bunch of patients', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/sequences/sequence/${Cypress.env('sequenceId')}`)

    cy.tick(10000)

    cy.get('[data-cy="sequence-button-enrollees"]').click()
    cy.get('[data-cy="sequence-enroll"]').click()

    cy.get('user-search').find('input').type('Test')
    cy.tick(10000)
    selectAutocompleteOption(0)

    cy.get('user-search').find('input').type('Test')
    cy.tick(10000)
    selectAutocompleteOption(1)

    attemptEnrollPatients()

    assertSequenceBulkEnrollmentRequest({
      accounts: ['1', '3'],
      organization: '1',
      sequence: `${Cypress.env('sequenceId')}`,
      executeAt: '2019-12-31T00:00:00',
      transition: '1674',
      createdBy: 1
    })
  })

  it('Properly enrolls a bunch of patients mid-sequence', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/sequences/sequence/${Cypress.env('sequenceId')}`)

    cy.tick(10000)

    cy.get('[data-cy="sequence-button-enrollees"]').click()
    cy.get('[data-cy="sequence-enroll"]').click()

    cy.get('user-search').find('input').type('Test')
    cy.tick(10000)
    cy.wait(1000)
    selectAutocompleteOption(0)

    cy.get('user-search').find('input').type('Test')
    cy.tick(10000)
    cy.wait(1000)
    selectAutocompleteOption(0)

    selectEnrollmentStep(3)

    attemptEnrollPatients()

    assertSequenceBulkEnrollmentRequest({
      accounts: ['1', '3'],
      organization: '1',
      sequence: `${Cypress.env('sequenceId')}`,
      executeAt: '2019-12-31T01:00:00',
      transition: '1836',
      createdBy: 1
    })
  })

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

    assertSequenceBulkOrganizationEnrollmentRequest({
      organization: '1',
      sequence: `${Cypress.env('sequenceId')}`,
      executeAt: '2019-12-31T00:00:00',
      transition: '1674'
    })
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

    assertSequenceBulkOrganizationEnrollmentRequest({
      organization: '1',
      sequence: `${Cypress.env('sequenceId')}`,
      executeAt: '2019-12-31T01:00:00',
      transition: '1836'
    })
  })
})
