/**
 * POST /content/
 */

export interface CreateContentRequest {
  /** Organization ID. */
  organization: string
  /** ID of the parent content item. */
  parentId?: string
  /** Item name. */
  name: string
  /** Extended item description. */
  description?: string
  /** ID of the content type. */
  type: string
  /** A flag indicating whether the content item is publicly available for viewing. */
  isPublic?: boolean
  /** Type-specific metadata. */
  metadata?: any
}
