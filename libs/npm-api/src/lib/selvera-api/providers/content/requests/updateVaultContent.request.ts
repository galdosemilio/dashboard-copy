export interface UpdateVaultContentRequest {
  /** Extended item description. Can be set to 'null' to clear the value. */
  description?: string
  /** ID of the vault item to update */
  id: string
  /** Item name */
  name?: string
  /** ID of the parent vault item. Can be set to 'null' to move item to the root content tree level. */
  parent?: string
  /** Sort order number used for enhanced default sorting. Can be set to 'null' to clear the value. */
  sortOrder?: number
}
