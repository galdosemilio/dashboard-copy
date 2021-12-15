export function deleteNote(content: string): void {
  cy.get(getNoteAlias(content))
    .find('mat-icon.clickable')
    .click({ force: true })
  cy.tick(1000)

  cy.get('mat-dialog-container').find('button').contains('Yes').click()
  cy.tick(1000)
}

export function getNoteAlias(content: string): string {
  const tag = Date.now() + `${Math.round(Math.random() * 100)}`

  cy.get('div.notes-container')
    .contains(new RegExp(`${content}`, 'g'))
    .parent()
    .parent()
    .as(`note${tag}`)

  // so the 'Date.now()' changes, diminishing the chances of collision
  cy.tick(Math.round(Math.random()) + 1)
  return `@note${tag}`
}
