import { standardSetup } from '../../../support'
import {
  addStep,
  assertSelectedStep,
  assertSequenceSettings,
  assertStepAction,
  clickEditSequenceTab,
  clickEnrolleesTab,
  clickSettingsTab,
  deleteStepAction,
  getStepRowAlias,
  saveSequence,
  selectStep,
  setRepeatingAction,
  StepActionType
} from './helpers'

describe('Sequences -> view', function () {
  it('Clinic shows properly for sequence listing', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/sequences`)

    cy.tick(2000)

    cy.get('app-sequencing-sequences-table')
      .find('mat-row')
      .should('have.length', 3)
    cy.get('app-sequencing-sequences-table')
      .find('mat-row')
      .eq(0)
      .should('contain', 'CoachCare (id 1)')
    cy.get('app-sequencing-sequences-table')
      .find('mat-row')
      .eq(1)
      .should('contain', 'CoachCare (id 1)')
    cy.get('app-sequencing-sequences-table')
      .find('mat-row')
      .eq(2)
      .should('contain', 'CoachCare (id 1)')
  })

  it('Clinic shows properly for individual sequence', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit('/sequences/sequence/1;s=edit')

    cy.tick(2000)

    cy.get('[data-cy="sequenceClinicInfo"]').contains(
      'Associated with clinic CoachCare 999 (ID 999)'
    )
  })

  it('Can see listing of sequences', function () {
    cy.setTimezone('et')
    standardSetup()
    cy.visit(`/sequences`)
    cy.get('h2').eq(0).should('contain', 'Sequences')
    cy.get('app-sequencing-sequences-table')
      .find('mat-row')
      .should('have.length', 3)
    cy.get('app-sequencing-sequences-table')
      .find('mat-row')
      .eq(0)
      .should('contain', 'first sequence')
      .should('contain', 'Mon, Aug 26 2019')
    cy.get('app-sequencing-sequences-table')
      .find('mat-row')
      .eq(1)
      .should('contain', 'second sequence')
      .should('contain', 'Tue, Aug 27 2019')
    cy.get('app-sequencing-sequences-table')
      .find('mat-row')
      .eq(2)
      .should('contain', 'third sequence')
      .should('contain', 'Wed, Aug 28 2019')
  })

  it('Can see a single, delay-complex sequence', function () {
    cy.setTimezone('et')
    standardSetup()
    cy.visit('/sequences/sequence/1;s=edit')
    cy.get('.step-list-item', { timeout: 20000 }).as('matSelectInputs')
    cy.clock().tick(100000)
    cy.get('@matSelectInputs').eq(0).should('contain', 'No delay')
    cy.get('@matSelectInputs').eq(0).should('contain', '11:00 p.m.')
    cy.get('@matSelectInputs').eq(1).should('contain', '1 day delay')
    cy.get('@matSelectInputs').eq(1).should('contain', '11:00 p.m.')
    cy.get('@matSelectInputs').eq(2).should('contain', '1 day delay')
    cy.get('@matSelectInputs').eq(2).should('contain', '3:00 a.m.')
    cy.get('@matSelectInputs').eq(3).should('contain', 'No delay')
    cy.get('@matSelectInputs').eq(3).should('contain', '4:00 a.m.')
    cy.get('@matSelectInputs').eq(4).should('contain', 'No delay')
    cy.get('@matSelectInputs').eq(4).should('contain', '5:00 a.m.')
    cy.get('@matSelectInputs').eq(5).should('contain', 'No delay')
    cy.get('@matSelectInputs').eq(5).should('contain', '6:00 a.m.')
    cy.get('@matSelectInputs').eq(6).should('contain', 'No delay')
    cy.get('@matSelectInputs').eq(6).should('contain', '7:00 a.m.')
    cy.get('@matSelectInputs').eq(7).should('contain', 'No delay')
    cy.get('@matSelectInputs').eq(7).should('contain', '8:00 a.m.')
    cy.get('@matSelectInputs').eq(8).should('contain', 'No delay')
    cy.get('@matSelectInputs').eq(8).should('contain', '9:00 a.m.')
    cy.get('@matSelectInputs').eq(9).should('contain', 'No delay')
    cy.get('@matSelectInputs').eq(9).should('contain', '10:00 a.m.')
    cy.get('@matSelectInputs').eq(10).should('contain', 'No delay')
    cy.get('@matSelectInputs').eq(10).should('contain', '11:00 a.m.')
    cy.get('@matSelectInputs').eq(11).should('contain', 'No delay')
    cy.get('@matSelectInputs').eq(11).should('contain', '12:00 p.m.')
    cy.get('@matSelectInputs').eq(12).should('contain', 'No delay')
    cy.get('@matSelectInputs').eq(12).should('contain', '1:00 p.m.')
    cy.get('@matSelectInputs').eq(13).should('contain', 'No delay')
    cy.get('@matSelectInputs').eq(13).should('contain', '2:00 p.m.')
    cy.get('@matSelectInputs').eq(14).should('contain', 'No delay')
    cy.get('@matSelectInputs').eq(14).should('contain', '3:00 p.m.')
    cy.get('@matSelectInputs').eq(15).should('contain', 'No delay')
    cy.get('@matSelectInputs').eq(15).should('contain', '4:00 p.m.')
    cy.get('@matSelectInputs').eq(16).should('contain', 'No delay')
    cy.get('@matSelectInputs').eq(16).should('contain', '5:00 p.m.')
    cy.get('@matSelectInputs').eq(17).should('contain', 'No delay')
    cy.get('@matSelectInputs').eq(17).should('contain', '6:00 p.m.')
    cy.get('@matSelectInputs').eq(18).should('contain', 'No delay')
    cy.get('@matSelectInputs').eq(18).should('contain', '7:00 p.m.')
    cy.get('@matSelectInputs').eq(19).should('contain', 'No delay')
    cy.get('@matSelectInputs').eq(19).should('contain', '8:00 p.m.')
    cy.get('@matSelectInputs').eq(20).should('contain', 'No delay')
    cy.get('@matSelectInputs').eq(20).should('contain', '9:00 p.m.')
    cy.get('@matSelectInputs').eq(21).should('contain', 'No delay')
    cy.get('@matSelectInputs').eq(21).should('contain', '10:00 p.m.')
    cy.get('@matSelectInputs').eq(22).should('contain', '1 day delay')
    cy.get('@matSelectInputs').eq(22).should('contain', '10:00 p.m.')
    cy.get('@matSelectInputs').eq(23).should('contain', '2 days delay')
    cy.get('@matSelectInputs').eq(23).should('contain', '11:00 p.m.')
    cy.get('@matSelectInputs').eq(24).should('contain', '1 day delay')
    cy.get('@matSelectInputs').eq(24).should('contain', '2:00 a.m.')
  })

  it('Send the proper offset in a looping sequence after adding one step', function () {
    cy.setTimezone('et')
    standardSetup({
      apiOverrides: [
        {
          url: '/1.0/sequence/enrollment**',
          fixture: 'api/general/emptyDataEmptyPagination'
        }
      ]
    })
    cy.visit('/sequences/sequence/1;s=edit')

    cy.get('.step-list-item', { timeout: 20000 }).as('matSelectInputs')
    cy.clock().tick(100000)

    cy.get('@matSelectInputs').should('have.length', 26)

    addStep()
    setRepeatingAction('loop')
    saveSequence()

    cy.wait('@sequencePostTransition', { timeout: 20000 }).should((xhr) => {
      expect(xhr.request.body.delay).to.equal('1 days')
    })

    cy.wait('@sequencePostTransition', { timeout: 20000 }).should((xhr) => {
      expect(xhr.request.body.delay).to.equal('1 days')
    })

    cy.wait('@sequencePostTransition', { timeout: 20000 }).should((xhr) => {
      expect(xhr.request.body.delay).to.equal('01:00:00')
    })
    cy.tick(1000)

    cy.wait('@sequencePostTransition', { timeout: 20000 }).should((xhr) => {
      expect(xhr.request.body.delay).to.equal('18:00:00')
    })
  })

  it('Retains the Sequence structure when traversing between tabs', function () {
    cy.setTimezone('et')
    standardSetup()
    cy.visit('/sequences/sequence/1;s=edit')

    cy.get('.step-list-item', { timeout: 20000 }).as('matSelectInputs')
    cy.tick(100000)

    clickEditSequenceTab()
    cy.tick(100000)

    assertStepStructure()

    cy.get('@matSelectInputs').should('have.length', 26)

    clickEnrolleesTab()
    clickEditSequenceTab()

    cy.get('@matSelectInputs').should('have.length', 26)
    cy.tick(1000000)

    assertStepStructure()
  })

  it('Prompts the correct requests for trigger deletion', function () {
    cy.setTimezone('et')
    standardSetup()
    cy.visit('/sequences/sequence/1;s=edit')

    cy.get('.step-list-item', { timeout: 20000 }).as('matSelectInputs')
    cy.tick(100000)

    assertStepAction('25', StepActionType.NOTIFICATION, {
      header: 'N 251',
      message: 'N 251'
    })

    deleteStepAction('25', StepActionType.NOTIFICATION, {
      header: 'N 251',
      message: 'N 251'
    })

    saveSequence()

    cy.tick(10000)
    cy.wait(1000)
    cy.tick(10000)

    cy.wait('@sequenceTriggerDeactivate', { timeout: 20000 }).should((xhr) => {
      expect(xhr.request.body.id).to.equal('3141')
      expect(xhr.request.body.isActive).to.equal(false)
    })
  })

  it('Remembers the previously selected step', function () {
    cy.setTimezone('et')
    standardSetup()
    cy.visit('/sequences/sequence/1;s=edit')

    cy.get('.step-list-item', { timeout: 20000 }).as('matSelectInputs')
    cy.tick(100000)

    selectStep('23')
    saveSequence()

    cy.tick(100000)
    cy.wait(300)
    cy.tick(100000)
    cy.wait(5000)
    cy.tick(100000)

    cy.get('.step-list-item', { timeout: 20000 })
    cy.tick(10000)

    assertSelectedStep('23')
  })

  it('Properly displays the settings of a Sequence', function () {
    cy.setTimezone('et')
    standardSetup()
    cy.visit('/sequences/sequence/1;s=edit')

    cy.get('.step-list-item', { timeout: 20000 }).as('matSelectInputs')
    cy.tick(100000)

    clickSettingsTab()

    assertSequenceSettings(true)
  })

  it('Allows the provider to change the settings of a Sequence', function () {
    cy.setTimezone('et')
    standardSetup()
    cy.visit('/sequences/sequence/1;s=edit')

    cy.get('.step-list-item', { timeout: 20000 }).as('matSelectInputs')
    cy.tick(100000)

    clickSettingsTab()

    cy.get('[data-cy="sequence-settings-section-force-email-branding"]')
      .find('.mat-slide-toggle-input')
      .click({ force: true })

    cy.tick(1000)

    cy.wait('@patchSequence').should((xhr) => {
      expect(xhr.request.body.enrollment).to.equal(null)
    })
  })

  it.only('Clinic shows properly sequence enrollments message logs', function () {
    cy.setTimezone('et')
    standardSetup()

    cy.visit(`/sequences/sequence/${Cypress.env('sequenceId')}`)

    cy.tick(10000)

    cy.get('[data-cy="sequence-button-enrollees"]').click()
    cy.contains('search').click()
    cy.get('[aria-label="Previously Sent"]').click()

    cy.get('mat-table mat-row')
      .eq(1)
      .should('contain', 'Push notification')
      .should('contain', 'Test')

    cy.get('[aria-label="Upcoming"]').click()

    cy.get('mat-table mat-row')
      .eq(1)
      .should('contain', 'SMS message')
      .should('contain', 'Hellow')

    cy.get('mat-table mat-row')
      .eq(2)
      .should('contain', 'E-mail')
      .should('contain', 'Test email')
  })
})

function assertStepStructure(): void {
  cy.get(getStepRowAlias('1')).contains('No delay')
  cy.get(getStepRowAlias('1')).contains('11:00 p.m.')

  cy.get(getStepRowAlias('2')).contains('1 day delay')
  cy.get(getStepRowAlias('2')).contains('11:00 p.m.')

  cy.get(getStepRowAlias('3')).contains('1 day delay')
  cy.get(getStepRowAlias('3')).contains('3:00 a.m.')

  cy.get(getStepRowAlias('4')).contains('No delay')
  cy.get(getStepRowAlias('4')).contains('4:00 a.m.')

  cy.get(getStepRowAlias('5')).contains('No delay')
  cy.get(getStepRowAlias('5')).contains('5:00 a.m.')

  cy.get(getStepRowAlias('6')).contains('No delay')
  cy.get(getStepRowAlias('6')).contains('6:00 a.m.')

  cy.get(getStepRowAlias('7')).contains('No delay')
  cy.get(getStepRowAlias('7')).contains('7:00 a.m.')

  cy.get(getStepRowAlias('8')).contains('No delay')
  cy.get(getStepRowAlias('8')).contains('8:00 a.m.')

  cy.get(getStepRowAlias('9')).contains('No delay')
  cy.get(getStepRowAlias('9')).contains('9:00 a.m.')

  cy.get(getStepRowAlias('10')).contains('No delay')
  cy.get(getStepRowAlias('10')).contains('10:00 a.m.')

  cy.get(getStepRowAlias('11')).contains('No delay')
  cy.get(getStepRowAlias('11')).contains('11:00 a.m.')

  cy.get(getStepRowAlias('12')).contains('No delay')
  cy.get(getStepRowAlias('12')).contains('12:00 p.m.')

  cy.get(getStepRowAlias('13')).contains('No delay')
  cy.get(getStepRowAlias('13')).contains('1:00 p.m.')

  cy.get(getStepRowAlias('14')).contains('No delay')
  cy.get(getStepRowAlias('14')).contains('2:00 p.m.')

  cy.get(getStepRowAlias('15')).contains('No delay')
  cy.get(getStepRowAlias('15')).contains('3:00 p.m.')

  cy.get(getStepRowAlias('16')).contains('No delay')
  cy.get(getStepRowAlias('16')).contains('4:00 p.m.')

  cy.get(getStepRowAlias('17')).contains('No delay')
  cy.get(getStepRowAlias('17')).contains('5:00 p.m.')

  cy.get(getStepRowAlias('18')).contains('No delay')
  cy.get(getStepRowAlias('18')).contains('6:00 p.m.')

  cy.get(getStepRowAlias('19')).contains('No delay')
  cy.get(getStepRowAlias('19')).contains('7:00 p.m.')

  cy.get(getStepRowAlias('20')).contains('No delay')
  cy.get(getStepRowAlias('20')).contains('8:00 p.m.')

  cy.get(getStepRowAlias('21')).contains('No delay')
  cy.get(getStepRowAlias('21')).contains('9:00 p.m.')

  cy.get(getStepRowAlias('22')).contains('No delay')
  cy.get(getStepRowAlias('22')).contains('10:00 p.m.')

  cy.get(getStepRowAlias('23')).contains('1 day delay')
  cy.get(getStepRowAlias('23')).contains('10:00 p.m.')

  cy.get(getStepRowAlias('24')).contains('2 days delay')
  cy.get(getStepRowAlias('24')).contains('11:00 p.m.')

  cy.get(getStepRowAlias('25')).contains('1 day delay')
  cy.get(getStepRowAlias('25')).contains('2:00 a.m.')

  cy.get(getStepRowAlias('26')).contains('100 days delay')
  cy.get(getStepRowAlias('26')).contains('5:00 a.m.')
}
