/**
 * Interface for POST /supplement
 */

export interface AddSupplementRequest {
  fullName: string
  shortName: string
  isActive?: boolean
}
