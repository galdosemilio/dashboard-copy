export const checkForEditAndDeleteAccount = (
  url: string,
  type: 'edit' | 'delete'
) => {
  cy.visit(url)

  cy.get('ccr-accounts-table', { timeout: 10000 })

  cy.get('button.mat-icon-button', { timeout: 10000 })
    .eq(type === 'edit' ? 0 : 1)
    .click()

  if (type === 'delete') {
    cy.get('button.ccr-button', { timeout: 10000 }).eq(0).click()
  } else {
    cy.get('.ccr-action-buttons')
      .get('[cy-data="edit-button"]', { timeout: 10000 })
      .eq(0)
      .click()
  }

  cy.get('simple-snack-bar', { timeout: 10000 }).should(
    'contain',
    type === 'edit' ? 'Account updated' : 'Account deactivated'
  )
}

export const checkAccountList = (url: string, accounts) => {
  cy.visit(url)

  cy.get('ccr-accounts-table', { timeout: 10000 })
    .find('mat-row')
    .as('accountRows')

  cy.get('@accountRows').should('have.length', accounts.length)

  for (let i = 0; i < accounts.length; i += 1) {
    cy.get('@accountRows')
      .eq(i)
      .should('contain', accounts[i].id)
      .should('contain', accounts[i].name)
      .should('contain', accounts[i].email)
  }
}
