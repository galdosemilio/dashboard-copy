/**
 * POST /package
 */

export interface CreatePackageRequest {
  /** The unique title of this package or product. */
  title: string;
  /** The public description of this package. */
  description?: string;
  /** The payload for package. */
  payload?: any;
}
