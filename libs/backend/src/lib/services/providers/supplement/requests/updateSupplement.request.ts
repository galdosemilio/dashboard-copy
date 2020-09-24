/**
 * PUT /supplement/:id
 */

export interface UpdateSupplementRequest {
  /** Supplement ID. */
  id: string;
  /** Supplement full name. */
  fullName?: string;
  /** Supplement abbreviated name. */
  shortName?: string;
  /** Supplement activity status value. */
  isActive?: boolean;
}
