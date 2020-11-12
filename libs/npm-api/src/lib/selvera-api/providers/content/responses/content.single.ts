/**
 * GET /content/:id
 */

import { Entity } from '../../common/entities'
import { ContentOrganization, ContentType } from '../entities'

export interface ContentSingle {
  /** A count of direct child items in the tree. Only returned for 'Folder' items */
  childCount?: number
  /** Identifier of the content item. */
  id: string
  /** Timestamp indicating when the item was created. */
  createdAt: string
  /** Content item name. */
  name: string
  /** Extended description of the item. */
  description?: string
  /** Type-specific metadata. Usually should contain mime type and URL for files, and content for embedded content. */
  metadata?: any
  /** Organization ID the content item belongs to. */
  organization: ContentOrganization
  /** Parent item ID. Will be missing for root-level items. */
  parentId?: string
  /** A collection of package IDs for which the associated items are affilated with */
  packages?: Array<Entity>
  /** Content item type. */
  type: ContentType
  /** True if the item has package associations */
  hasPackageAssociations?: boolean
  /** Sort order number used for enhanced default sorting. Can be set to `null` to clear the value. */
  sortOrder?: number
}
