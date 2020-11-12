import { ApiOverrideEntry, interceptCoreApiCalls, seti18n } from './api'
import './commands'
import { setSystemDate } from './date'
import {
  setGuideStorage,
  setProviderSiteCookie,
  setSiteLanguageToEnglish
} from './state'

const standardSetup = (
  startDate?: number,
  apiOverrides?: ApiOverrideEntry[],
  enableGuides: boolean = false
): void => {
  cy.log('Init standard setup')
  cy.server()

  setSystemDate(startDate ? startDate : null)
  seti18n()
  setGuideStorage(!enableGuides)
  setProviderSiteCookie()
  setSiteLanguageToEnglish()
  interceptCoreApiCalls(apiOverrides)
}

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

export { standardSetup }
