/**
 * GET /key
 */

export interface GetAllKeyRequest {
  /** The target search string. */
  name?: string;
  /** Offset for pagination. */
  offset?: string;
  /** Flag that indicates whether the result should include not active keys. */
  includeInactive?: boolean;
}
