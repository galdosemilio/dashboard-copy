/**
 * POST /supplement
 */

export interface CreateSupplementRequest {
  /** Supplement full name. */
  fullName: string;
  /** Supplement abbreviated name. */
  shortName: string;
  /** Activity status flag. */
  isActive?: boolean;
}
