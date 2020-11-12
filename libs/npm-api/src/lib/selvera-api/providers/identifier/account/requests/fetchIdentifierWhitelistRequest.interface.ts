export interface FetchIdentifierWhitelistRequest {
  organization: string
  status?: 'active' | 'inactive' | 'all'
}
