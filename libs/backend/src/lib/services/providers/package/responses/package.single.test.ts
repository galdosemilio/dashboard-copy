/**
 * GET /package/:id
 */

import { createTestFromValidator, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { packageTranslation } from '../../../shared/index.test';
import { PackageSingle } from './package.single';

export const packageSingle = createValidator({
  /** The id of this package entry. */
  id: t.string,
  /** The title of this package entry. */
  title: t.string,
  /** The description of this product. */
  description: optional(t.string),
  /** Indicates whether this package is active. */
  isActive: t.boolean,
  /** The time this entry was created. */
  createdAt: t.string,
  /** The time this entry was updated. */
  updatedAt: t.string,
  /** Translations collection. */
  translations: t.array(packageTranslation)
});

export const packageResponse = createTestFromValidator<PackageSingle>(
  'PackageSingle',
  packageSingle
);
