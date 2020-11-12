import { standardSetup } from '../../../support'

describe('Patients Listing Page', () => {
  beforeEach(() => {
    cy.setTimezone('et')
    standardSetup()
  })

  it('Patient Listing', () => {
    cy.visit('/admin/accounts/patients')

    cy.get('ccr-accounts-table', { timeout: 10000 })
      .find('mat-row')
      .as('patientRows')

    cy.get('@patientRows').should('have.length', 3)

    cy.get('@patientRows')
      .eq(0)
      .should('contain', '6784')
      .should('contain', '00000000000000sdkjnaskjdn dnaskjnadkj')
      .should('contain', 'kajsnkasjdn@gmail.com')

    cy.get('@patientRows')
      .eq(1)
      .should('contain', '6783')
      .should('contain', '00000000000aaaaaateeest kjnkdansd')
      .should('contain', 'dkadkha@gmail.com')

    cy.get('@patientRows')
      .eq(2)
      .should('contain', '6786')
      .should('contain', '00000000test test2')
      .should('contain', 'aksdkasnjasdj@gmail.com')
  })

  it('Patient Deletion', () => {
    cy.visit('/admin/accounts/patients')

    cy.get('ccr-accounts-table', { timeout: 10000 })

    cy.get('button.mat-icon-button', { timeout: 10000 }).eq(1).click()

    cy.get('button.ccr-button', { timeout: 10000 }).eq(0).click()

    cy.get('simple-snack-bar', { timeout: 10000 }).should(
      'contain',
      'Account deactivated'
    )
  })

  it('Patient Editing', () => {
    cy.visit('/admin/accounts/patients')

    cy.get('ccr-accounts-table', { timeout: 10000 })

    cy.get('button.mat-icon-button', { timeout: 10000 }).eq(0).click()

    cy.get('button.ccr-icon-button', { timeout: 10000 }).eq(0).click()

    cy.get('simple-snack-bar', { timeout: 10000 }).should(
      'contain',
      'Account updated'
    )
  })
})
