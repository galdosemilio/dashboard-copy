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

Cypress.on('window:before:load', function (window) {
  const original = window.EventTarget.prototype.addEventListener

  window.EventTarget.prototype.addEventListener = function () {
    if (arguments && arguments[0] === 'beforeunload') {
      return
    }
    return original.apply(this, arguments)
  }

  Object.defineProperty(window, 'onbeforeunload', {
    get: function () {},
    set: function () {}
  })
})

export { standardSetup }
