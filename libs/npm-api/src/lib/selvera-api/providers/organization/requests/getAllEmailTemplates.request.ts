/**
 * Interface for GET /organization/preference/email
 */

export interface GetAllEmailTemplatesRequest {
  organization: string
  strict?: boolean
  offset?: number
  operation?:
    | 'password-reset'
    | 'new-account'
    | 'internal-registration'
    | 'token-expiration'
  category?: 'client' | 'other'
  limit?: number | 'all'
  locale?: string
}
