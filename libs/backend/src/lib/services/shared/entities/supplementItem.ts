/**
 * SupplementItem
 */

export interface SupplementItem {
  /** ID of the supplement. */
  id: string;
  /** Full name of the supplement, in requested locale if available. */
  fullName: string;
  /** Short name of the supplement, in requested locale if available. */
  shortName: string;
  /** Supplement activity status flag. */
  isActive: boolean;
}
