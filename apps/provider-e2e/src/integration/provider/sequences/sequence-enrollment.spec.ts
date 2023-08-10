import { standardSetup } from '../../../support'
import {
  assertSequenceBulkEnrollmentRequest,
  assertSequenceBulkOrganizationEnrollmentRequest,
  attemptBulkEnrollPatients,
  attemptEnrollPatients,
  selectDateOnCalendar,
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
    cy.wait(1500)

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
    cy.wait(1500)
    cy.tick(5000)

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
      executeAt: '2020-01-02T03:00:00',
      transition: '1836',
      createdBy: 1
    })
  })

  it('Properly enrolls all the patients in a clinic', function () {
    cy.wait(1500)
    cy.tick(5000)

    cy.get('[aria-label="All patients in clinic"]').click()

    cy.tick(5000)

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
    cy.tick(5000)

    cy.get('[aria-label="All patients in selected phase(s)"]').click()

    cy.tick(5000)

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
    cy.wait(1500)
    cy.tick(5000)

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
      executeAt: '2020-01-02T03:00:00',
      transition: '1836'
    })
  })

  it('Steps for enrollment properly show as executing "immediately" when start date is in the past', function () {
    cy.tick(1000)
    cy.get('[data-cy="sequence-preview-active-cell"]')
      .should('have.length', 26)
      .as('activeCells')
    cy.get('@activeCells').eq(0).contains('Tue, Dec 31 2019 11:00 pm')
    cy.get('@activeCells').eq(25).contains('Wed, Apr 15 2020 5:00 am')

    selectDateOnCalendar('24')
    cy.tick(1000)

    cy.get('[data-cy="sequence-preview-active-cell"]')
      .should('have.length', 26)
      .as('activeCellsBackdated')
    cy.get('@activeCellsBackdated').eq(0).contains('Immediately')
    cy.get('@activeCellsBackdated').eq(24).contains('Immediately')
    cy.get('@activeCellsBackdated').eq(25).contains('Wed, Apr 8 2020 5:00 am')
  })

  it('Proper previous start date is passed', function () {
    cy.wait(1500)
    cy.tick(5000)

    cy.get('user-search').find('input').type('Test')
    cy.tick(10000)
    selectAutocompleteOption(1)

    selectDateOnCalendar('24')

    attemptEnrollPatients()

    assertSequenceBulkEnrollmentRequest({
      accounts: ['3'],
      organization: '1',
      sequence: `${Cypress.env('sequenceId')}`,
      executeAt: '2019-12-24T00:00:00',
      transition: '1674',
      createdBy: 1
    })
  })
})
