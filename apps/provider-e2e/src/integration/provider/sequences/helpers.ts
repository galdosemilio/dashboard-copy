export const hours = [
  'Midnight',
  '1:00 a.m.',
  '2:00 a.m.',
  '3:00 a.m.',
  '4:00 a.m.',
  '5:00 a.m.',
  '6:00 a.m.',
  '7:00 a.m.',
  '8:00 a.m.',
  '9:00 a.m.',
  '10:00 a.m.',
  '11:00 a.m.',
  '12:00 p.m.',
  '1:00 p.m.',
  '2:00 p.m.',
  '3:00 p.m.',
  '4:00 p.m.',
  '5:00 p.m.',
  '6:00 p.m.',
  '7:00 p.m.',
  '8:00 p.m.',
  '9:00 p.m.',
  '10:00 p.m.',
  '11:00 p.m.'
]

export enum StepActionType {
  NOTIFICATION = 'notification',
  EMAIL = 'email',
  SMS = 'sms'
}

export function activateReorder(): void {
  cy.get('.ccr-icon-button').contains('Reorder Steps').trigger('click')

  cy.tick(10000)
  cy.wait(500)
}

export function addAction(stepName: string): void {
  cy.get(`${stepName}`).find('button').contains('Add Action').trigger('click')
}

export function addStep(): void {
  cy.get('button').contains(' Add Step ').trigger('click')

  cy.tick(10000)
  cy.wait(200)
}

export function addStepAction(
  stepName: string,
  actionType: StepActionType,
  values: any = {}
): void {
  cy.get(getStepRowAlias(stepName)).trigger('click')
  cy.tick(1000)
  cy.get('div.step-input-container')
    .find('button')
    .contains('Add Action')
    .trigger('click')

  switch (actionType) {
    case StepActionType.NOTIFICATION:
      cy.get('.mat-select-trigger:last').trigger('click').wait(500)

      cy.get('.mat-select-panel:last')
        .find('mat-option')
        .contains('Notification')
        .trigger('click')
        .trigger('blur', { force: true })
        .wait(500)

      cy.tick(1000)

      cy.get('sequencing-notification-form:last')
        .eq(0)
        .find('input[data-placeholder="Header Text"]')
        .type(values.header)
      cy.get('sequencing-notification-form:last')
        .eq(0)
        .find('input[data-placeholder="Message"]')
        .type(values.message)
      break
    case StepActionType.EMAIL:
      cy.get('.mat-select-trigger:last').trigger('click').wait(500)

      cy.get('.mat-select-panel:last')
        .find('mat-option')
        .contains('Email')
        .trigger('click')
        .trigger('blur', { force: true })
        .wait(500)

      cy.tick(1000)

      cy.get('sequencing-email-form:last')
        .eq(0)
        .find('input[data-placeholder="Header Text"]')
        .type(values.header)
      cy.get('sequencing-email-form:last')
        .eq(0)
        .find('input[data-placeholder="Subject Line"]')
        .type(values.subject)
      cy.get('sequencing-email-form:last')
        .eq(0)
        .find('textarea[data-placeholder="Message"]')
        .type(values.message)
      break
    case StepActionType.SMS:
      cy.get('.mat-select-trigger:last').trigger('click').wait(500)

      cy.get('.mat-select-panel:last')
        .find('mat-option')
        .contains('SMS')
        .trigger('click')
        .trigger('blur', { force: true })
        .wait(500)

      cy.tick(1000)

      cy.get('sequencing-sms-form:last')
        .eq(0)
        .find('input[data-placeholder="Message"]')
        .type(values.message)
      break
  }

  cy.tick(1000)
}

export function assertSelectedStep(stepName: string): void {
  cy.get(getStepRowAlias(stepName)).should('have.class', 'active')
  cy.tick(1000)
}

export function assertSequenceBulkEnrollmentRequest(args: {
  accounts: string[]
  organization: string
  sequence: string
  executeAt: string
  transition: string
  createdBy: number
}): void {
  cy.wait('@sequenceBulkEnrollmentPostRequest').should((xhr) => {
    expect(xhr.request.body.accounts.toString()).to.equal(
      args.accounts.toString()
    )
    expect(xhr.request.body.organization).to.equal(args.organization)
    expect(xhr.request.body.sequence).to.equal(args.sequence)
    expect(xhr.request.body.executeAt.local).to.equal(args.executeAt)
    expect(xhr.request.body.transition).to.equal(args.transition)
    expect(xhr.request.body.createdBy).to.equal(args.createdBy)
  })
}

export function assertSequenceBulkOrganizationEnrollmentRequest(args: {
  organization: string
  sequence: string
  executeAt: string
  transition: string
}): void {
  cy.wait('@sequenceBulkOrganizationEnrollmentPostRequest').should((xhr) => {
    expect(xhr.request.body.organization).to.equal(args.organization)
    expect(xhr.request.body.sequence).to.equal(args.sequence)
    expect(xhr.request.body.executeAt.local).to.equal(args.executeAt)
    expect(xhr.request.body.transition).to.equal(args.transition)
  })
}

export function assertSequenceSettings(forceBranding: boolean): void {
  cy.get('[data-cy="sequence-settings-section-force-email-branding"]')
    .find('.mat-slide-toggle-input')
    .should(`${forceBranding ? '' : 'not.'}be.checked`)
}

export function assertStepAction(
  stepName: string,
  actionType: StepActionType,
  values: any = {}
): void {
  let targetComponent = ''
  let placeholder = ''
  let inputType = ''

  cy.get(getStepRowAlias(stepName)).trigger('click')
  cy.tick(10000)
  cy.tick(100000)

  switch (actionType) {
    case StepActionType.NOTIFICATION:
      targetComponent = 'sequencing-notification-form'
      break
    case StepActionType.EMAIL:
      targetComponent = 'sequencing-email-form'
      break
    case StepActionType.SMS:
      targetComponent = 'sequencing-sms-form'
      break
  }

  /**
   * This assertion has the limitation of potentially finding the result
   * accross different components so try using totally different contents for each
   * step action.
   */
  if (!targetComponent) {
    return
  }

  Object.keys(values).forEach((key) => {
    switch (key) {
      case 'message':
        placeholder = 'Message'
        break

      case 'subject':
        placeholder = 'Subject Line'
        break

      case 'header':
        placeholder = 'Header Text'
        break

      default:
        placeholder = ''
    }

    inputType =
      targetComponent === 'sequencing-email-form' && placeholder === 'Message'
        ? 'textarea'
        : 'input'

    if (!placeholder) {
      return
    }

    cy.get(`${targetComponent}`)
      .find(`${inputType}[data-placeholder="${placeholder}"]`)
      .then((element) => {
        expect(element.val()).to.eql(values[key])
      })
  })
}

export function attemptBulkEnrollPatients(): void {
  cy.get('mat-dialog-container')
    .find('button')
    .contains('Bulk Enroll')
    .click({ force: true })
  cy.tick(1000)
}

export function attemptEnrollPatients(): void {
  cy.get('mat-dialog-container')
    .find('button')
    .contains('Enroll Patients')
    .click({ force: true })
  cy.tick(1000)
}

export function clickEditSequenceTab(): void {
  cy.get('div.ccr-tabs').find('a').contains('Edit Sequence').click()

  cy.tick(10000)
}

export function clickEnrolleesTab(): void {
  cy.get('div.ccr-tabs').find('a').contains('Enrollees').click()

  cy.tick(10000)
}

export function clickSettingsTab(): void {
  cy.get('div.ccr-tabs').find('a').contains('Settings').click()

  cy.tick(10000)
}

export function deactivateReorder(): void {
  cy.get('.ccr-icon-button').contains('Save Step Order').trigger('click')

  cy.tick(10000)
}

export function deleteStep(stepName: string): void {
  cy.get(getStepRowAlias(stepName))
    .find('mat-icon:visible')
    .contains('delete')
    .eq(0)
    .trigger('click')

  cy.tick(1000)
}

export function deleteStepAction(
  stepName: string,
  actionType: StepActionType,
  values: any = {}
): void {
  assertStepAction(stepName, actionType, values)

  let targetComponent = ''

  cy.get(getStepRowAlias(stepName)).trigger('click')
  cy.tick(10000)
  cy.tick(100000)

  switch (actionType) {
    case StepActionType.NOTIFICATION:
      targetComponent = 'sequencing-notification-form'
      break
    case StepActionType.EMAIL:
      targetComponent = 'sequencing-email-form'
      break
    case StepActionType.SMS:
      targetComponent = 'sequencing-sms-form'
      break
  }

  if (targetComponent) {
    cy.get(`${targetComponent}`)
      .parent()
      .parent()
      .parent()
      .parent()
      .find('.mat-icon.clickable')
      .eq(1)
      .click({ force: true })

    cy.tick(10000)
  }
}

export function dragStep(draggedStep: string, targetStep: string): void {
  cy.tick(10000)

  const draggedAlias = getStepRowAlias(draggedStep)
  const targetAlias = getStepRowAlias(targetStep)
  const dataTransfer = new DataTransfer()

  cy.get(draggedAlias)
    .trigger('mouseover')
    .trigger('mousemove')
    .trigger('mousedown')
    .trigger('dragstart', { dataTransfer })

  cy.tick(10000)
  cy.wait(500)

  cy.get(targetAlias)
    .trigger('mouseover')
    .trigger('mousemove')
    .trigger('mouseup')
    .trigger('drop', { dataTransfer })
    .trigger('dragend')

  cy.tick(10000)
  cy.wait(1000)
}

export function getStepRowAlias(stepName: string): string {
  const tag = Date.now() + `${Math.round(Math.random() * 100)}`
  cy.get('.step-list-item:not(".deleted")')
    .contains(new RegExp(`^${stepName}\$`, 'g'))
    .parent()
    .parent()
    .parent()
    .parent()
    .parent()
    .as(`stepRow${tag}`)

  // so the 'Date.now()' changes, diminishing the chances of collision
  cy.tick(Math.round(Math.random()) + 1)
  return `@stepRow${tag}`
}

export function renameStep(stepName: string, newName: string): void {
  setStepName(getStepRowAlias(stepName), newName)
  cy.tick(1000)
}

export function saveSequence(): void {
  cy.get('sequencing-sequence')
    .find('button')
    .contains('Save')
    .trigger('click', { force: true })

  cy.tick(10000)
}

export function selectAutocompleteOption(index: number): void {
  cy.get('mat-option').eq(index).click({ force: true })

  cy.tick(1000)
}

export function selectEnrollmentStep(index: number): void {
  cy.get('mat-dialog-container')
    .find('mat-select[ng-reflect-placeholder="Starting Step"]')
    .find('.mat-select-trigger')
    .trigger('click', { force: true })
    .wait(500)

  cy.get('mat-option').eq(index).trigger('click', { force: true })

  cy.tick(10000)
  cy.wait(500)
}

export function selectTime(stepName: string, timeName: string): void {
  cy.get(`${stepName}`)
    .find('ccr-inline-editable-field')
    .eq(2)
    .as('inlineEditableField')

  cy.get('@inlineEditableField').trigger('mouseover').trigger('click').wait(100)

  cy.get('@inlineEditableField')
    .find('mat-icon', { timeout: 1000 })
    .eq(0)
    .trigger('click', { force: true })

  cy.clock().tick(5000)

  cy.get(`@inlineEditableField`)
    .find('.mat-select-trigger')
    .trigger('click')
    .wait(500)

  cy.get('mat-option')
    .contains(`${timeName}`)
    .trigger('click', { force: true })
    .wait(500)
}

export function selectDelay(stepName: string, delayName: string) {
  cy.get(`${stepName}`)
    .find('ccr-inline-editable-field')
    .eq(1)
    .as('inlineEditableField')

  cy.get('@inlineEditableField').trigger('mouseover').trigger('click').wait(100)

  cy.get('@inlineEditableField')
    .find('mat-icon', { timeout: 1000 })
    .eq(0)
    .trigger('click', { force: true })

  cy.clock().tick(5000)

  cy.get(`@inlineEditableField`)
    .find('input[type="number"]')
    .type(delayName.split(' ')[0])
    .wait(500)

  cy.get('@inlineEditableField')
    .find('mat-icon')
    .contains('check_circle')
    .click({ force: true })

  cy.tick(1000)
}

export function selectStep(stepName: string): void {
  cy.get(getStepRowAlias(stepName))
    .find('ccr-inline-editable-field')
    .eq(0)
    .trigger('click', { force: true })
  cy.tick(10000)
}

export function setRepeatingAction(action: 'end' | 'loop'): void {
  cy.get('.step-list-container')
    .find('.mat-select-trigger')
    .trigger('click')
    .wait(500)

  cy.get('.mat-option')
    .contains(action === 'loop' ? 'Repeat from Beginning' : 'End')
    .trigger('click')

  cy.tick(1000)
}

export function setSequenceTitle(title: string): void {
  cy.get('input[data-placeholder="Sequence Name"]').type(title)
}

export function setStepDelay(stepName: string, delayName: string) {
  selectDelay(getStepRowAlias(stepName), delayName)
  cy.tick(1000)
}

export function setStepHour(stepName: string, hourName: string) {
  selectTime(getStepRowAlias(stepName), hourName)
  cy.tick(1000)
}

export function setStepName(stepRowName: string, stepName: string): void {
  cy.get(`${stepRowName}`)
    .find('ccr-inline-editable-field')
    .eq(0)
    .as('inlineEditableField')

  cy.get('@inlineEditableField').trigger('mouseover').trigger('click').wait(100)

  cy.get('@inlineEditableField')
    .find('mat-icon', { timeout: 1000 })
    .eq(0)
    .trigger('click', { force: true })

  cy.clock().tick(5000)

  cy.get(`${stepRowName}`).find('input').type(stepName).trigger('blur')
}

export function verifyAvailableTimes(stepName: string, timeName: string): void {
  cy.get(`${stepName}`)
    .find('ccr-inline-editable-field')
    .eq(2)
    .as('inlineEditableField')

  cy.get('@inlineEditableField').trigger('mouseover').trigger('click').wait(100)

  cy.get('@inlineEditableField')
    .find('mat-icon', { timeout: 1000 })
    .eq(0)
    .trigger('click', { force: true })

  cy.clock().tick(5000)

  cy.get(`@inlineEditableField`)
    .find('.mat-select-trigger')
    .trigger('click')
    .wait(500)

  cy.get('mat-option').as('hourOptions')

  const timePosition = hours.indexOf(timeName)
  cy.get('@hourOptions').should('have.length', hours.length - timePosition)

  const hoursSubset = [...hours].splice(timePosition)
  hoursSubset.forEach((hour, i) => {
    cy.get('@hourOptions').eq(i).should('contain', hour)
  })

  cy.get('@hourOptions').contains(`${timeName}`).trigger('click').wait(500)
}
