/**
 * Interface for PUT /supplement/:id
 */

export interface UpdateSupplementRequest {
  id: string
  fullName?: string
  shortName?: string
  isActive?: boolean
}
