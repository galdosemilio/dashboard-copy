/**
 * Interface for POST /logging
 */

export type AppNameType =
  | 'ccr-mobile'
  | 'ccr-mobileApp'
  | 'ccr-staticProvider'
  | 'ccr-staticAuth'
  | 'ccr-staticClient'

export type LogLevelType =
  | 'trace'
  | 'debug'
  | 'info'
  | 'warn'
  | 'error'
  | 'fatal'

export interface AddLogRequest {
  app: AppNameType
  keywords: Array<any>
  logLevel: LogLevelType
  message: String
}
