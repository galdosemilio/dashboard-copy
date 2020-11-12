/**
 * Interface for PATCH /meeting/type/:typeId
 */

export interface UpdateMeetingTypeRequest {
  typeId: string
  code?: string
  description?: string
  isActive?: boolean
}
