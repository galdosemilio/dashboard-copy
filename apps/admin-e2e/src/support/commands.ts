declare namespace Cypress {
  interface Chainable<Subject> {
    setTimezone(value: string): Chainable<void>
    setOrganization(value: 'ccr' | 'cmwl' | 'test-ip-clinic'): Chainable<void>
  }
}

Cypress.Commands.add('setTimezone', (tz: 'en' | 'aet') => {
  let tzProper: string

  switch (tz) {
    case 'aet':
      tzProper = 'Australia/Sydney'
      break
    default:
      tzProper = 'America/New_York'
  }

  cy.log(`setting timezone to ${tzProper}...`)
  Cypress.env('timezone', tzProper)
})

Cypress.Commands.add(
  'setOrganization',
  (org: 'ccr' | 'cmwl' | 'test-ip-clinic') => {
    let translatedOrg: number

    switch (org) {
      case 'cmwl':
        translatedOrg = 6955
        break
      case 'test-ip-clinic':
        translatedOrg = 3378
        break
      case 'ccr':
      default:
        translatedOrg = 1
    }

    cy.log(`setting organizationId to ${translatedOrg}...`)
    Cypress.env('organizationId', translatedOrg)
  }
)

Cypress.Commands.add('setOrgCookie', (orgId: string) => {
  cy.setCookie('ccrOrg', orgId)
})
