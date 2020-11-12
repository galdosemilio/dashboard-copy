/**
 * Interface for GET /rpm/state/audit
 */
export interface GetAuditListRequest {
  account: string
  asOf?: string
  limit?: number | 'all'
  offset: number
  organization: string
  strict?: boolean
}
