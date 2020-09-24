/**
 * orgListSegment
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { allOrgPermissions, orgSegment } from '../generic/index.test';

export const orgListSegment = createValidator({
  /** Organization object. */
  organization: orgSegment,
  /** The permissions object. It's only included for provider accounts. */
  permissions: optional(allOrgPermissions),
  /** A flag indicating if the entry indicates a direct association with an organization or a cascaded entry. */
  isDirect: t.boolean
});
