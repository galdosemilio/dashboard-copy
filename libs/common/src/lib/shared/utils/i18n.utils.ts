import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams
} from '@ngx-translate/core'

/**
 * Helps to identify the missing key instead a blank value
 */
export class MissingStringsHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    return params.key
  }
}

/**
 * Utility to mark extract-able strings
 */
export function _<T>(text: T): T {
  return text
}
