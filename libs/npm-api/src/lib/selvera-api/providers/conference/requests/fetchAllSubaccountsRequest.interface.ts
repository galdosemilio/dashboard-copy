/**
 * Interface for GET /conference/subaccount
 */

export interface FetchAllSubaccountsRequest {
  organization: string
  activeOnly?: boolean
}
