/**
 * PATCH /content/:id
 */

export interface UpdateContentRequest {
  /** ID of the content item to update. */
  id: string;
  /** ID of the parent content item. Can be set to 'null' to move item to the root content tree level. */
  parentId?: string;
  /** Item name. */
  name?: string;
  /** A flag indicating whether the content item is publicly available for viewing. */
  isPublic?: boolean;
  /** Extended item description. */
  description?: string;
}
