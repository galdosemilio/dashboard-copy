/**
 * POST /key
 */

export interface CreateKeyRequest {
  /** Desired name of a key. */
  name: string;
  /** Desired description of a key. */
  description: string;
}
