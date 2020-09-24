/**
 * packageAssociation
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { entity } from '../generic/index.test';
import { packageData } from './packageData.test';

export const packageAssociation = createValidator({
  /** ID of an organization-package association. */
  id: t.string,
  /** Package-organization association activity status flag. */
  isActive: t.boolean,
  /** Organization-specific sort order for this package. */
  sortOrder: optional(t.number),
  /** Additional organization-specific data stored for this package. */
  payload: optional(t.any),
  /** Organization object. */
  organization: entity,
  /** Timestamp of association creation. */
  createdAt: t.string,
  /** Timestamp of association last update. */
  updatedAt: t.string,
  /** Package data object. */
  package: packageData
});
