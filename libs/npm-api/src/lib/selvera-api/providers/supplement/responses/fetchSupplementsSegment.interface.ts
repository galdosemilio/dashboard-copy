/**
 * Interface for GET /supplement/organization (Segment)
 */

import { Entity } from '../../common/entities'

export interface FetchSupplementsSegment {
  /** ID of an organization-supplement association. */
  id: string
  /** Organization object. */
  organization: Entity
  /** Core supplement data. */
  supplement: {
    /** ID of the supplement. */
    id: string
    /** Full name of the supplement, in requested locale if available. */
    fullName: string
    /** Short name of the supplement, in requested locale if available. */
    shortName: string
    /** Supplement activity status flag. */
    isActive: boolean
  }
  /** Dosage for the supplement for given organization. */
  dosage?: string
}
