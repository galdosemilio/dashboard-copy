export interface GetLoginHistoryRequest {
  account: string
  limit?: number | 'all'
  offset?: number
  organization?: string
}
