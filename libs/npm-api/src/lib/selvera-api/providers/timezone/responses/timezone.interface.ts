import { TimezoneLanguageResponse } from './timezoneLanguage.interface'

/**
 * Interface for get timezones (Response)
 */

export interface TimezoneResponse {
  code: string
  lang: TimezoneLanguageResponse
}
