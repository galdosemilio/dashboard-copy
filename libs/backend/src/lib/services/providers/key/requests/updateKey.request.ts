/**
 * PATCH /key
 */

export interface UpdateKeyRequest {
  /** Id of target key. */
  id: string;
  /** Desired new value of `isActive` field at target key. */
  isActive?: boolean;
  /** Desired new value of `name` field at target key. */
  name?: string;
  /** Desired new value of `description` field at target key. */
  description?: string;
}
