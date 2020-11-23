/**
 * Interface for api header options
 */

export interface HeaderOptions {
  readonly account?: 'admin' | 'manager' | 'provider' | 'client'
  readonly cookieDomain?: string
  readonly appName?: string
  readonly appVersion?: string
  readonly organizationId?: string
  readonly platform?: string
  readonly brand?: string
  readonly APILevel?: string
  readonly deviceCountry?: string
  readonly deviceLocale?: string
  readonly userAgent?: string
  readonly timezone?: string
  readonly systemVersion?: string
  readonly platformVersion?: string
  readonly organization?: string
}
