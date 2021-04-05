export interface GetRPMReasonsRequest {
  status?: 'active' | 'inactive' | 'all'
  limit?: number | 'all'
  offset?: number
  appliesToState?: 'active' | 'inactive'
}
