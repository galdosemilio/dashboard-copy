/**
 * GET /content/:id
 */

import { createTestFromValidator, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { contentType, orgRefOpt } from '../../../shared/index.test';
import { ContentSingle } from './content.single';

export const contentSingle = createValidator({
  /** Identifier of the content item. */
  id: t.string,
  /** Timestamp indicating when the item was created. */
  createdAt: t.string,
  /** Content item name. */
  name: t.string,
  /** Extended description of the item. */
  description: optional(t.string),
  /** Type-specific metadata. Usually should contain mime type and URL for files, and content for embedded content. */
  metadata: optional(t.any),
  /** Organization to which the content item belongs. */
  organization: orgRefOpt,
  /** Parent item ID. Will be missing for root-level items. */
  parentId: optional(t.string),
  /** Content item type. */
  type: contentType,
  /** True if the item has package associations. */
  hasPackageAssociations: t.boolean
});

export const contentResponse = createTestFromValidator<ContentSingle>(
  'ContentSingle',
  contentSingle
);
