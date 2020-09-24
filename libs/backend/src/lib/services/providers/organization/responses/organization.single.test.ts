/**
 * GET /organization/:id
 */

import { createTestFromValidator, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { addressItem, contactItem, orgPreference } from '../../../shared/index.test';
import { OrganizationSingle } from './organization.single';

export const organizationSingle = createValidator({
  /** Organization ID. */
  id: t.string,
  /** Organization name. */
  name: t.string,
  /** Organization shortcode. */
  shortcode: t.string,
  /** Creation timestamp. */
  createdAt: optional(t.string),
  /** A path of hierarchy IDs. */
  hierarchyPath: t.array(t.string),
  /** Organization active flag. */
  isActive: t.boolean,
  /** Contact information. */
  contact: contactItem,
  /** Address data. */
  address: optional(addressItem),
  /** Basic organization preferences, including the hierarchy chain. */
  preferences: t.array(orgPreference)
});

export const organizationResponse = createTestFromValidator<OrganizationSingle>(
  'OrganizationSingle',
  organizationSingle
);
