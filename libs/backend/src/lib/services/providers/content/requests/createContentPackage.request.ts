/**
 * PUT /content/:id/package/:package
 */

export interface CreateContentPackageRequest {
  /** Content item ID. */
  id: string;
  /** ID of the package. */
  package: string;
}
