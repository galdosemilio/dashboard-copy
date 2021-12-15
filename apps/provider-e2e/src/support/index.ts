import { ApiOverrideEntry, interceptCoreApiCalls, seti18n } from './api'
import './commands'
import { setSystemDate } from './date'
import {
  setGuideStorage,
  setProviderSiteCookie,
  setProviderSiteCookieAsClient,
  setSiteLanguageToEnglish
} from './state'

export interface StandardSetupOptions {
  apiOverrides?: ApiOverrideEntry[]
  enableGuides?: boolean
  mode?: 'client' | 'provider' // we default to 'provider'
  startDate?: number
}

const standardSetup = (opts: StandardSetupOptions = {}): void => {
  cy.log('Init standard setup')

  setSystemDate(opts.startDate ?? null)
  seti18n()
  setGuideStorage(!opts.enableGuides)

  if (opts.mode === 'client') {
    setProviderSiteCookieAsClient()
  } else {
    setProviderSiteCookie()
  }

  setSiteLanguageToEnglish()
  interceptCoreApiCalls(opts.apiOverrides ?? [], opts.mode)
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
