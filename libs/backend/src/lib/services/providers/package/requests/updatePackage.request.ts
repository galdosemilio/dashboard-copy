/**
 * PATCH /package/:id
 */

export interface UpdatePackageRequest {
  /** The id of the package to update, passed as the last URI parameter. */
  id: string;
  /** The unique title of this package or product. */
  title?: string;
  /** The public description of this package. */
  description?: string;
  /** If this package is active. */
  isActive?: boolean;
  /** The payload for package. Can be `null` to clear the payload contents. */
  payload?: any;
}
