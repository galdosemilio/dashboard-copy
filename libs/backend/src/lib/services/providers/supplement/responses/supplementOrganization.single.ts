/**
 * GET /supplement/organization/:id
 */

import { SupplementItem } from '../../../shared';

export interface SupplementOrganizationSingle {
  /** ID of the supplement-organization association. */
  id: string;
  /** ID of the organization. */
  organizationId: string;
  data: {
    supplements: {
      /** Core supplement data. */
      supplement: SupplementItem;
    };
  };
  /** Organization-specific dosage data for the supplement. */
  dosage?: number;
  /** Custom sort order. */
  sortOrder?: number;
}
