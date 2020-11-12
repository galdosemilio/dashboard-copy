import { Entity } from '../../common/entities'
import { ContentOrganization, ContentType } from '../entities'

export interface VaultContentSingle {
  /** Account entity the vault item belongs to */
  account: Entity
  /** Timestamp indicating when the item was created */
  createdAt: string
  /** Extended description of the item */
  description?: string
  /** ID of the vault item */
  id: string
  /** Type-specific metadata. Usually should contain mime type and URL for files, and content for embedded content. */
  metadata?: any
  /** Vault item name */
  name: string
  /** Organization entity the vault item belongs to */
  organization: ContentOrganization
  /** Parent item entity. Will be missing for root-level items. */
  parent?: Entity
  /** Sort order number for enhanced default sorting */
  sortOrder?: number
  /** Vault item type */
  type: ContentType
}
