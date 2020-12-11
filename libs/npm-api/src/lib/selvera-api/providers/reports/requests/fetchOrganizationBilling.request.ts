/**
 * Interface for GET /warehouse/billing/organization
 */

export interface FetchOrganizationBillingRequest {
  asOf: string
  organization: string
  status: 'active' | 'inactive' | 'all'
  limit?: number | 'all'
  offset?: number
}
