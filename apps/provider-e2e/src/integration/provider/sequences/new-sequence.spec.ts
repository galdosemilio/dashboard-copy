import { standardSetup } from '../../../support'
import {
  activateReorder,
  addStep,
  addStepAction,
  assertStepAction,
  deactivateReorder,
  deleteStep,
  dragStep,
  getStepRowAlias,
  renameStep,
  saveSequence,
  selectDelay,
  selectTime,
  setRepeatingAction,
  setSequenceTitle,
  setStepDelay,
  setStepHour,
  setStepName,
  StepActionType,
  verifyAvailableTimes
} from './helpers'

/*
  select time from modal
  verify count and visible times in modal
*/

describe('Sequences -> new', function () {
  beforeEach(() => {
    cy.setTimezone('et')
    standardSetup()
    cy.wait(1000)
  })

  it('Clinic shows properly for new sequence', function () {
    cy.visit(`/sequences/new`)

    cy.tick(2000)
    cy.get('[data-cy="sequenceClinicInfo"]').contains(
      'Associated with clinic CoachCare (ID 1)'
    )

    cy.get('.step-list-item').as('steps')
  })

  it('Hours availablity respect previous selections', function () {
    cy.visit(`/sequences`)

    // Create new sequence with 3 steps
    cy.get('.ccr-icon-button').contains('Create New Sequence').trigger('click')

    cy.get('input[data-placeholder="Sequence Name"]').type(
      'sequence with hours'
    )

    cy.get('button').contains(' Add Step ').trigger('click').trigger('click')

    cy.wait(1000)

    cy.get('.step-list-item').as('steps')

    cy.get('@steps').should('have.length', 3)

    cy.get('@steps').eq(0).as('firstStep')

    cy.get('@steps').eq(1).as('secondStep')

    cy.get('@steps').eq(2).as('thirdStep')

    // Verify all hours show
    selectTime('@firstStep', 'Midnight')

    // Verify all times except for midnight show
    selectTime('@secondStep', '2:00 a.m.')

    // change first step to 7 am and verify second step doesn't have anything before 8am available
    selectTime('@firstStep', '7:00 a.m.')
    verifyAvailableTimes('@secondStep', '8:00 a.m.')
    selectTime('@secondStep', '8:00 a.m.')

    // verify 3rd step shows nothing before 8am
    verifyAvailableTimes('@thirdStep', '9:00 a.m.')

    // change second step to 3pm
    selectTime('@secondStep', '3:00 p.m.')
    verifyAvailableTimes('@thirdStep', '4:00 p.m.')

    // Add fourth step and verify defaulted time is correct
    cy.get('button').contains(' Add Step ').trigger('click')

    cy.get('.step-list-item').as('steps')

    cy.get('@steps').should('have.length', 4)

    cy.get('@steps').eq(3).as('fourthStep')

    verifyAvailableTimes('@fourthStep', '5:00 p.m.')
  })

  it('Create new sequence', function () {
    cy.visit(`/sequences`)

    cy.get('.ccr-icon-button').contains('Create New Sequence').trigger('click')

    setSequenceTitle('sequence 4')
    addStep()

    cy.get('.step-list-item').as('stepRows')

    cy.get('@stepRows').should('have.length', 2)

    cy.get('@stepRows').eq(0).as('firstStepRow')
    cy.get('@stepRows').eq(1).as('secondStepRow')

    // Prep first step
    cy.get('@firstStepRow').trigger('click')

    cy.wait(500)
    cy.clock().tick(1000000)

    cy.get('sequencing-step-input').as('steps')

    cy.get('@steps').eq(0).as('firstStep')

    setStepName('@firstStepRow', 'first step')

    cy.get('@firstStep')
      .find('button')
      .contains('Add Action')
      .trigger('click')
      .trigger('click')
      .trigger('click')
      .trigger('click')

    cy.get('@firstStep').find('mat-select').eq(0).trigger('click').wait(500)

    cy.get('.mat-select-panel')
      .find('mat-option')
      .contains('Email')
      .trigger('click', { force: true })
      .wait(500)

    cy.get('@firstStep').find('mat-select').eq(1).trigger('click').wait(500)

    cy.get('.mat-select-panel')
      .find('mat-option')
      .contains('Notification')
      .trigger('click', { force: true })
      .wait(500)

    cy.get('@firstStep').find('mat-select').eq(3).trigger('click').wait(500)

    cy.get('.mat-select-panel')
      .find('mat-option')
      .contains('SMS')
      .trigger('click', { force: true })
      .wait(500)

    cy.get('@firstStep').find('mat-select').eq(4).trigger('click').wait(500)

    cy.get('.mat-select-panel')
      .find('mat-option')
      .contains('Phase Enrollment')
      .trigger('click', { force: true })
      .wait(500)

    // email text
    cy.get('sequencing-email-form')
      .eq(0)
      .find('input[data-placeholder="Subject Line"]')
      .type('email subject 1')
    cy.get('sequencing-email-form')
      .eq(0)
      .find('input[data-placeholder="Header Text"]')
      .type('email header 1')
    cy.get('sequencing-email-form')
      .eq(0)
      .find('textarea[data-placeholder="Message"]')
      .type('email message 1')

    // notification text
    cy.get('sequencing-notification-form')
      .eq(0)
      .find('input[data-placeholder="Header Text"]')
      .type('notification header 1')

    cy.get('sequencing-notification-form')
      .eq(0)
      .find('input[data-placeholder="Message"]')
      .type('notification message 1')

    // sms text
    cy.get('sequencing-sms-form')
      .eq(0)
      .find('input[data-placeholder="Message"]')
      .type('message message 1')

    // select package to enroll
    cy.get('@firstStep').find('mat-select').eq(5).trigger('click').wait(500)

    cy.get('.mat-select-panel')
      .find('mat-option')
      .contains('Package 1')
      .trigger('click')
      .wait(500)

    cy.get('@secondStepRow').trigger('click')

    // Prep second step
    cy.get('@steps').eq(0).as('secondStep')

    setStepName('@secondStepRow', 'second step')
    selectDelay('@secondStepRow', '2 days delay')
    selectTime('@secondStepRow', '7:00 a.m.')

    cy.get('@secondStep')
      .find('button')
      .contains('Add Action')
      .trigger('click')
      .trigger('click')
      .trigger('click')
      .trigger('click')

    cy.get('@secondStep').find('mat-select').eq(0).trigger('click').wait(500)

    cy.get('.mat-select-panel')
      .find('mat-option')
      .contains('Email')
      .trigger('click', { force: true })
      .wait(500)

    cy.get('@secondStep').find('mat-select').eq(1).trigger('click').wait(500)

    cy.get('.mat-select-panel')
      .find('mat-option')
      .contains('Notification')
      .trigger('click', { force: true })
      .wait(500)

    cy.get('@secondStep').find('mat-select').eq(3).trigger('click').wait(500)

    cy.get('.mat-select-panel')
      .find('mat-option')
      .contains('SMS')
      .trigger('click', { force: true })
      .wait(500)

    cy.get('@secondStep').find('mat-select').eq(4).trigger('click').wait(500)

    cy.get('.mat-select-panel')
      .find('mat-option')
      .contains('Phase Enrollment')
      .trigger('click', { force: true })
      .wait(500)

    // add email text
    cy.get('@secondStepRow').trigger('click')
    cy.wait(500)

    cy.get('sequencing-email-form')
      .eq(0)
      .find('input[data-placeholder="Subject Line"]')
      .type('email subject 2')
    cy.get('sequencing-email-form')
      .eq(0)
      .find('input[data-placeholder="Header Text"]')
      .type('email header 2')
    cy.get('sequencing-email-form')
      .eq(0)
      .find('textarea[data-placeholder="Message"]')
      .type('email message 2')

    // add notification text
    cy.get('@secondStepRow').trigger('click')

    cy.get('sequencing-notification-form')
      .eq(0)
      .find('input[data-placeholder="Header Text"]')
      .type('notification header 2')

    cy.get('sequencing-notification-form')
      .eq(0)
      .find('input[data-placeholder="Message"]')
      .type('notification message 2')

    // add sms text
    cy.get('@secondStepRow').trigger('click')

    cy.get('sequencing-sms-form')
      .eq(0)
      .find('input[data-placeholder="Message"]')
      .type('message message 2')

    // select package to enroll
    cy.get('@secondStep').find('mat-select').eq(5).trigger('click').wait(500)

    cy.get('.mat-select-panel')
      .find('mat-option')
      .contains('Package 3')
      .trigger('click')
      .wait(500)

    cy.get('sequencing-sequence')
      .find('button')
      .contains('Save')
      .trigger('click', { force: true })

    cy.wait('@postSequence').should((xhr) => {
      expect(xhr.request.body.name).to.equal('sequence 4')
    })

    cy.wait(5000)
  })

  it('Displays sequence preview and extra iteration for repeatable sequence', function () {
    cy.visit(`/sequences`)

    cy.get('.ccr-icon-button').contains('Create New Sequence').trigger('click')

    setSequenceTitle('sequence 4')
    addStep()
    cy.get('.step-list-item').as('steps')
    cy.get('@steps').eq(1).as('secondStepRow')

    selectDelay('@secondStepRow', '2 days delay')
    selectTime('@secondStepRow', '7:00 a.m.')
    cy.get('.mat-select-trigger').trigger('click').wait(500)
    cy.get('.mat-option').contains(`Repeat from Beginning`).trigger('click')
    cy.tick(10000)

    cy.get('[data-cy="sequence-preview-table"]').find('mat-row').as('tableRow')

    cy.get('@tableRow').eq(0).should('contain', 'Immediately')
    cy.get('@tableRow').eq(1).should('contain', 'Thu, Jan 2 2020 7:00 am')
    cy.get('@tableRow').eq(2).should('contain', 'Fri, Jan 3 2020 12:00 am')
    cy.get('@tableRow').eq(3).should('contain', 'Sun, Jan 5 2020 7:00 am')
  })

  it('Displays correctly a repeatable sequence with 6 days delay', function () {
    cy.visit(`/sequences`)

    cy.get('.ccr-icon-button').contains('Create New Sequence').trigger('click')

    setSequenceTitle('6 days delay sequence')
    cy.get('.step-list-item').as('steps')
    cy.get('@steps').eq(0).as('firstStepRow')

    selectDelay('@firstStepRow', '6 days delay')
    selectTime('@firstStepRow', '7:00 a.m.')
    cy.get('.mat-select-trigger').trigger('click').wait(500)
    cy.get('.mat-option').contains(`Repeat from Beginning`).trigger('click')
    cy.tick(10000)

    cy.get('[data-cy="sequence-preview-table"]').find('mat-row').as('tableRow')

    cy.get('@tableRow').eq(0).should('contain', 'Mon, Jan 6 2020 7:00 am')
    cy.get('@tableRow').eq(1).should('contain', 'Mon, Jan 13 2020 7:00 am')
    selectTime('@firstStepRow', 'Midnight')
    cy.get('.mat-select-trigger').trigger('click').wait(500)
    cy.get('.mat-option').contains(`Repeat from Beginning`).trigger('click')
    cy.tick(10000)
    cy.get('@tableRow').eq(0).should('contain', 'Mon, Jan 6 2020 12:00 am')
    cy.get('@tableRow').eq(1).should('contain', 'Mon, Jan 13 2020 12:00 am')
  })

  it('Looping transition delay is offset to the end of the day', function () {
    cy.visit(`/sequences`)

    cy.get('.ccr-icon-button').contains('Create New Sequence').trigger('click')

    cy.get('input[data-placeholder="Sequence Name"]').type('Looping sequence')

    cy.clock().tick(5000)

    cy.get('button').contains(' Add Step ').trigger('click')

    cy.clock().tick(5000)

    cy.get('.step-list-item').as('stepRows')

    cy.get('@stepRows').should('have.length', 2)

    cy.get('@stepRows').eq(0).as('firstStepRow')

    selectTime('@firstStepRow', '7:00 a.m.')

    cy.clock().tick(5000)

    cy.get('.mat-select-trigger').trigger('click').wait(500)

    cy.get('.mat-option').contains(`Repeat from Beginning`).trigger('click')

    cy.clock().tick(5000)

    cy.get('sequencing-sequence')
      .find('button')
      .contains('Save')
      .trigger('click', { force: true })

    cy.wait('@sequencePostTransition', { timeout: 20000 }).should((xhr) => {
      expect(xhr.request.body.delay).to.equal('01:00:00')
    })

    cy.wait('@sequencePostTransition', { timeout: 20000 }).should((xhr) => {
      expect(xhr.request.body.delay).to.equal('07:00:00')
    })

    // Accomodate for loop of sequence
    cy.wait('@sequencePostTransition', { timeout: 20000 }).should((xhr) => {
      expect(xhr.request.body.delay).to.equal('16:00:00')
    })

    cy.wait(3000)
  })

  it('Can properly offset looping transitions with removed steps', function () {
    cy.visit(`/sequences`)

    cy.get('.ccr-icon-button').contains('Create New Sequence').trigger('click')

    cy.clock().tick(5000)

    setSequenceTitle('Looping Transition with Removed Step')

    addStep()

    setStepHour('Step 2', '1:00 a.m.')

    addStep()

    deleteStep('Step 3')

    setRepeatingAction('loop')

    saveSequence()

    cy.wait('@sequencePostTransition', { timeout: 20000 }).should((xhr) => {
      expect(xhr.request.body.delay).to.equal('01:00:00')
    })

    cy.wait('@sequencePostTransition', { timeout: 20000 }).should((xhr) => {
      expect(xhr.request.body.delay).to.equal(undefined)
    })

    cy.wait('@sequencePostTransition', { timeout: 20000 }).should((xhr) => {
      expect(xhr.request.body.delay).to.equal('23:00:00')
    })

    cy.wait(3000)
  })

  it.skip('Can properly offset looping transition with moved steps', function () {
    cy.visit(`/sequences`)

    cy.get('.ccr-icon-button').contains('Create New Sequence').trigger('click')

    cy.clock().tick(5000)

    setSequenceTitle('Looping Transition with Moved Step')

    addStep()
    addStep()

    setStepHour('Step 2', '6:00 a.m.')

    activateReorder()
    dragStep('Step 3', 'Step 2')
    deactivateReorder()

    setRepeatingAction('loop')
    saveSequence()

    cy.wait('@sequencePostTransition', { timeout: 20000 }).should((xhr) => {
      expect(xhr.request.body.delay).to.equal(undefined)
    })

    cy.wait('@sequencePostTransition', { timeout: 20000 }).should((xhr) => {
      expect(xhr.request.body.delay).to.equal('07:00:00')
    })

    cy.wait('@sequencePostTransition', { timeout: 20000 }).should((xhr) => {
      expect(xhr.request.body.delay).to.equal('01:00:00')
    })

    cy.wait('@sequencePostTransition', { timeout: 20000 }).should((xhr) => {
      expect(xhr.request.body.delay).to.equal('16:00:00')
    })

    cy.wait(3000)
  })

  it.skip('Can edit the sequence without losing consistency', function () {
    cy.visit(`/sequences`)

    cy.get('.ccr-icon-button').contains('Create New Sequence').trigger('click')

    setSequenceTitle('A lot of actions')

    addStep()
    addStep()
    addStep()
    addStep()

    setStepHour('Step 1', '1:00 a.m.')
    setStepHour('Step 3', '6:00 a.m.')
    setStepDelay('Step 2', '3 days delay')
    setStepHour('Step 1', '11:00 p.m.')
    deleteStep('Step 3')
    setStepHour('Step 2', '11:00 p.m.')
    addStepAction('Step 1', StepActionType.SMS, {
      message: 'SMS 11'
    })

    activateReorder()
    dragStep('Step 1', 'Step 4')
    dragStep('Step 4', 'Step 1')
    deactivateReorder()

    addStepAction('Step 4', StepActionType.NOTIFICATION, {
      header: 'N 41',
      message: 'N 41'
    })

    addStep()

    renameStep('Step 8', 'Step 6')

    addStepAction('Step 6', StepActionType.EMAIL, {
      header: 'E 61',
      message: 'E 61',
      subject: 'E 61'
    })

    deleteStep('Step 5')

    activateReorder()
    dragStep('Step 2', 'Step 1')
    deactivateReorder()

    addStepAction('Step 4', StepActionType.EMAIL, {
      header: 'E 42',
      message: 'E 42',
      subject: 'E 42'
    })

    activateReorder()
    dragStep('Step 4', 'Step 6')
    deactivateReorder()

    deleteStep('Step 2')

    setStepDelay('Step 6', 'No delay')

    activateReorder()
    dragStep('Step 6', 'Step 4')
    deactivateReorder()

    cy.get(getStepRowAlias('Step 1')).contains('1 day delay')
    cy.get(getStepRowAlias('Step 1')).contains('11:00 p.m.')
    assertStepAction('Step 1', StepActionType.SMS, { message: 'SMS 11' })

    cy.get(getStepRowAlias('Step 6')).contains('1 day delay')
    cy.get(getStepRowAlias('Step 6')).contains('9:00 a.m.')
    assertStepAction('Step 6', StepActionType.EMAIL, {
      header: 'E 61',
      message: 'E 61',
      subject: 'E 61'
    })

    cy.get(getStepRowAlias('Step 4')).contains('1 day delay')
    cy.get(getStepRowAlias('Step 4')).contains('7:00 a.m.')
    assertStepAction('Step 4', StepActionType.NOTIFICATION, {
      header: 'N 41',
      message: 'N 41'
    })
    assertStepAction('Step 4', StepActionType.EMAIL, {
      header: 'E 42',
      message: 'E 42',
      subject: 'E 42'
    })
  })

  it('Can duplicate a sequence', function () {
    cy.visit(`/sequences`)

    cy.get('app-sequencing-sequences-table').find('mat-row').as('sequenceRows')

    cy.get('@sequenceRows').eq(0).find('mat-icon').eq(0).click({ force: true })

    cy.tick(1000)

    cy.get('mat-dialog-container')
      .find('mat-form-field')
      .eq(1)
      .trigger('click')
      .wait(300)

    cy.get('.mat-option').eq(0).trigger('click')

    cy.tick(1000)

    cy.get('button').contains('Duplicate').click()

    cy.get('simple-snack-bar').contains('Sequence saved successfully')

    cy.wait('@getSequences')
  })

  it('Shows the max length warnings for SMS and Notification inputs', function () {
    cy.visit(`/sequences`)

    cy.get('.ccr-icon-button').contains('Create New Sequence').trigger('click')

    setSequenceTitle('Looping Transition with Moved Step')

    addStep()

    cy.get('sequencing-step-input').as('steps')
    cy.get('@steps').eq(0).as('firstStep')

    cy.get('@firstStep')
      .find('button')
      .contains('Add Action')
      .trigger('click')
      .trigger('click')

    cy.get('@firstStep').find('mat-select').eq(0).trigger('click').wait(500)

    cy.get('.mat-select-panel')
      .find('mat-option')
      .contains('Notification')
      .trigger('click', { force: true })
      .wait(500)

    cy.get('@firstStep').find('mat-select').eq(2).trigger('click').wait(500)

    cy.get('.mat-select-panel')
      .find('mat-option')
      .contains('SMS')
      .trigger('click', { force: true })
      .wait(500)

    cy.get('sequencing-notification-form')
      .eq(0)
      .find('input[data-placeholder="Header Text"]')
      .type('notification header 1')

    cy.get('sequencing-notification-form')
      .eq(0)
      .find('input[data-placeholder="Message"]')
      .type(
        'notification message 1notification message 1notification message 1notification message 1notification message 1notification message 1notification message 1notification message 1notification message 1notification message 1notification message 1notification message 1notification message 1notification message 1notification message 1notification message 1'
      )

    cy.get('sequencing-sms-form')
      .eq(0)
      .find('input[data-placeholder="Message"]')
      .type(
        'sms message 1sms message 1sms message 1sms message 1sms message 1sms message 1sms message 1sms message 1sms message 1sms message 1sms message 1sms message 1sms message 1sms message 1sms message 1sms message 1sms message 1sms message 1sms message 1sms message 1sms message 1sms message 1sms message 1sms message 1sms message 1sms message 1sms message 1sms message 1'
      )

    cy.get('sequencing-notification-form')
      .eq(0)
      .should(
        'contain',
        'Notification message exceeds the recommended maximum length.'
      )
    cy.get('sequencing-sms-form')
      .eq(0)
      .should('contain', 'SMS message exceeds the recommended maximum length.')
  })
})
