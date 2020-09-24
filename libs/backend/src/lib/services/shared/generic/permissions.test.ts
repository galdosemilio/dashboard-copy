/**
 * Permissions
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { AllOrgPermissions, OrgPermissions } from './permissions';

export const orgPermissions = createValidator<OrgPermissions>({
  viewAll: t.boolean,
  admin: t.boolean,
  assignment: t.boolean
});

export const allOrgPermissions = createValidator<AllOrgPermissions>({
  ...orgPermissions.type.props,
  allowClientPhi: t.boolean
});
