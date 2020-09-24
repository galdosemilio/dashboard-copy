/**
 * KeySegment
 */

export interface KeySegment {
  /** Id of a key. */
  id: string;
  /** Name of a key. */
  name: string;
  /** Description of a key. */
  description: string;
  /** Date and time of key creation. */
  createdAt: string;
  /** Flag that indicates whether the key is active. */
  isActive: boolean;
}
