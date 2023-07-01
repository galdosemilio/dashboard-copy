import { standardSetup } from '../../../support'
import {
  assertSequenceBulkEnrollmentRequest,
  assertSequenceBulkOrganizationEnrollmentRequest,
  attemptBulkEnrollPatients,
  attemptEnrollPatients,
  selectEnrollmentStep
} from './helpers'
import { selectAutocompleteOption } from '../../helpers'

describe('Sequence -> View -> Enrollments', function () {
  beforeEach(() => {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/sequences/sequence/${Cypress.env('sequenceId')}`)

    cy.tick(10000)

    cy.get('[data-cy="sequence-button-enrollees"]').click()
    cy.get('[data-cy="sequence-enroll"]').click()
  })

  it('Properly enrolls a bunch of patients', function () {
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
    cy.get('[aria-label="All patients in clinic"]').click()

    cy.tick(1000)

    cy.get('ccr-organization-search').find('input').type('Coachcare')
    selectAutocompleteOption(0)
    cy.get('[data-cy="sequence-org-child"]').should(
      'contain',
      'Includes all patients in the CoachCare clinic and 2 child clinic(s)'
    )

    attemptBulkEnrollPatients()

    const orgs = ['1', '7411', '6940']

    orgs.forEach((organization) => {
      assertSequenceBulkOrganizationEnrollmentRequest({
        organization,
        sequence: `${Cypress.env('sequenceId')}`,
        executeAt: '2019-12-31T00:00:00',
        transition: '1674'
      })
    })

    cy.get('@sequenceBulkOrganizationEnrollmentPostRequest.all').should(
      'have.length',
      3
    )

    const reqs = [1, 2, 3]

    reqs.forEach((req) => {
      cy.get(`@sequenceBulkOrganizationEnrollmentPostRequest.${req}`)
        .its('request')
        .should((request) => {
          expect(request.body).to.not.have.property('packages')
        })
    })

    cy.get('.mat-simple-snack-bar-content').should(
      'contain',
      'Patients enrolled successfully.'
    )
  })

  it('Properly enrolls all the patients in selected phase(s)', function () {
    cy.get('[aria-label="All patients in selected phase(s)"]').click()

    cy.tick(1000)

    cy.get('ccr-organization-search').find('input').type('Coachcare')
    selectAutocompleteOption(0)
    cy.get('[data-cy="sequence-org-child"]').should(
      'contain',
      'Includes all patients in the CoachCare clinic and 2 child clinic(s)'
    )

    cy.tick(10000)
    cy.get('[data-cy="sequence-package-select"]')
      .click()
      .get('.mat-option')
      .contains('Package 1')
      .trigger('click')
      .get('.mat-option')
      .contains('Package 2')
      .trigger('click')

    attemptBulkEnrollPatients()

    assertSequenceBulkOrganizationEnrollmentRequest({
      organization: '1',
      sequence: `${Cypress.env('sequenceId')}`,
      executeAt: '2019-12-31T00:00:00',
      transition: '1674'
    })

    cy.get('@sequenceBulkOrganizationEnrollmentPostRequest.all').should(
      'have.length',
      3
    )

    const reqs = [1, 2, 3]

    reqs.forEach((req) => {
      cy.get(`@sequenceBulkOrganizationEnrollmentPostRequest.${req}`)
        .its('request')
        .should((request) => {
          expect(request.body.packages.toString()).to.eq(['1', '2'].toString())
        })
    })

    cy.get('.mat-simple-snack-bar-content').should(
      'contain',
      'Patients enrolled successfully.'
    )
  })

  it('Properly enrolls all the patients in a clinic mid-sequence', function () {
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
