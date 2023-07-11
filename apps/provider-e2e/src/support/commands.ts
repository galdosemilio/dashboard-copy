import { ValidOrganization } from './organizations'
declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      setTimezone(value: string): Chainable<void>
      setOrganization(value: ValidOrganization): Chainable<void>
    }
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

Cypress.Commands.add('setOrganization', (org: ValidOrganization) => {
  let translatedOrg: number

  switch (org) {
    case 'cmwl':
      translatedOrg = 6955
      break
    case 'ccr':
      translatedOrg = 1
      break
    case 'mdteam':
      translatedOrg = 7384
      break
    case 'inhealth':
      translatedOrg = 7242
      break
    case 'shiftsetgo':
      translatedOrg = 7355
      break
    case 'apollo-italy':
      translatedOrg = 9000
      break
    case 'apollo-us':
      translatedOrg = 8000
      break
    case 'wellcore':
      translatedOrg = 7535
      break
    case 'musclewise':
      translatedOrg = 7537
      break
    case 'idealyou':
      translatedOrg = 3235
      break
    case 'sharp':
      translatedOrg = 3328
      break
    default:
      translatedOrg = 1
  }

  cy.log(`setting organizationId to ${translatedOrg}...`)
  Cypress.env('organizationId', translatedOrg)
})
