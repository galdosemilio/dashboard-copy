/**
 * Interface for POST /warehouse/organization/sign-ups
 */

export interface SignupsSnapshotRequest {
  organization: string
  startDate?: string
  endDate?: string
  includeInactiveOrganizations?: boolean
}
