/**
 * GET /content/:id
 */

import { ContentType, OrgRefOpt } from '../../../shared';

export interface ContentSingle {
  /** Identifier of the content item. */
  id: string;
  /** Timestamp indicating when the item was created. */
  createdAt: string;
  /** Content item name. */
  name: string;
  /** Extended description of the item. */
  description?: string;
  /** Type-specific metadata. Usually should contain mime type and URL for files, and content for embedded content. */
  metadata?: any;
  /** Organization to which the content item belongs. */
  organization: OrgRefOpt;
  /** Parent item ID. Will be missing for root-level items. */
  parentId?: string;
  /** Content item type. */
  type: ContentType;
  /** True if the item has package associations. */
  hasPackageAssociations: boolean;
}
