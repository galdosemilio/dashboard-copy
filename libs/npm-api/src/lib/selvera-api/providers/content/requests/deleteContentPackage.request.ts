/**
 * DELETE /content/:id/package/:package
 */

export interface DeleteContentPackageRequest {
  /** ID of the item. */
  id: string
  /** ID of the package. */
  package: string
}
