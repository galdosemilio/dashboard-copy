/**
 * Interface for PATCH /key/organization
 */

export interface UpdateOrganizationKeyRequest {
  id: string
  icon?: string
  isActive?: boolean
  targetQuantity?: number | string
}
