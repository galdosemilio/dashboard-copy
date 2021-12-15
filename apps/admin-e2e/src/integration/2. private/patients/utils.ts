export function syncThirdPartyService(index: number, service: string) {
  cy.get('ccr-integrations-device-sync')
    .find('button.ccr-icon-button')
    .should('be.enabled')
    .eq(index)
    .click()

  cy.tick(5000)

  if (service === 'healthkit') {
    cy.wait('@healthkitSyncPutRequest').should((xhr) => {
      expect(xhr.request.body.account).to.equal('6784')
    })
  } else {
    cy.wait('@deviceSyncPostRequest').should((xhr) => {
      expect(xhr.request.body.account).to.equal('6784')
      expect(xhr.request.body.range).to.be.an('object')
      expect(xhr.request.body.service).to.equal(service)
    })
  }
}
