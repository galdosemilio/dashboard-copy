/**
 * GET /supplement/organization/:id
 */

import { createTestFromValidator, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { supplementItem } from '../../../shared/index.test';
import { SupplementOrganizationSingle } from './supplementOrganization.single';

export const supplementOrganizationSingle = createValidator({
  /** ID of the supplement-organization association. */
  id: t.string,
  /** ID of the organization. */
  organizationId: t.string,
  data: createValidator({
    supplements: createValidator({
      /** Core supplement data. */
      supplement: supplementItem
    })
  }),
  /** Organization-specific dosage data for the supplement. */
  dosage: optional(t.number),
  /** Custom sort order. */
  sortOrder: optional(t.number)
});

export const supplementOrganizationResponse = createTestFromValidator<SupplementOrganizationSingle>(
  'SupplementOrganizationSingle',
  supplementOrganizationSingle
);
