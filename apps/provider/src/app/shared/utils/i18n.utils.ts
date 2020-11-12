import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams
} from '@ngx-translate/core'

export class MissingStringsHandler implements MissingTranslationHandler {
  // helps to identify the missing key instead a blank value
  handle(params: MissingTranslationHandlerParams) {
    return params.key
  }
}

/**
 * Utility to mark extract-able strings.
 */
export function _(text: string): string {
  return text
}
