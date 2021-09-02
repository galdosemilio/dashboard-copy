import {
  CONTENT_TYPE_MAP,
  ContentTypeMapItem
} from '@app/dashboard/content/models/content-type.map'
import { FILE_TYPE_MAP } from '@app/dashboard/content/models/file-type.map'
import { Icon } from '@app/dashboard/content/models/icon.interface'
import { Package } from '@app/shared/components/package-table'
import { ContentOrganization } from '@coachcare/sdk'

export interface FileExplorerContentMetadata {
  id?: string
  url: string
  mimeType: string
  key: string
  size?: number
  content?: string
}

export class FileExplorerContent {
  public checked?: boolean
  public id: string
  public name: string
  public metadata?: FileExplorerContentMetadata
  parent?: string
  public parentId?: string
  public type: ContentTypeMapItem
  public organization: ContentOrganization
  public isForeign: boolean
  public isAdmin?: boolean
  public isFolder: boolean
  public icon: Icon
  public createdAt: string
  public isLastForeign?: boolean
  public isPublic: boolean
  public localSortOrder?: boolean
  public description: string
  public extension?: string
  public packages?: Package[]
  public hasPackageAssociations?: boolean
  public sortOrder?: number
  public isVisibleToPatient?: boolean

  constructor(args: any, opts?: any) {
    this.checked = args.checked || false
    this.id = args.id || ''
    this.name = args.name ? args.name : ''
    this.metadata = args.metadata
    this.parentId = args.parentId
    this.parent = args.parentId || args.parent
    this.type = Object.assign(
      {},
      CONTENT_TYPE_MAP[args.type ? args.type.code : 'default'],
      args.type
    )
    this.organization = args.organization
    this.isForeign =
      opts && opts.organizationId
        ? this.organization.id !== opts.organizationId
        : false
    this.isFolder = args.type ? args.type.code === 'folder' : false
    this.isAdmin = args.isAdmin || false
    if (this.type.code === 'file') {
      if (this.metadata.mimeType === 'text/html') {
        this.type = this.metadata.content
          ? this.metadata.content.includes('vimeo')
            ? CONTENT_TYPE_MAP.vimeo
            : CONTENT_TYPE_MAP.youtube
          : CONTENT_TYPE_MAP.hyperlink
      } else {
        this.extension = args.name.substring(
          args.name.lastIndexOf('.') + 1,
          args.name.length
        )
      }
    }
    if (FILE_TYPE_MAP[this.extension]) {
      this.icon = FILE_TYPE_MAP[this.extension].icon
      this.type.name = FILE_TYPE_MAP[this.extension].name
    } else {
      this.icon = CONTENT_TYPE_MAP[this.type.code]
        ? CONTENT_TYPE_MAP[this.type.code].icon
        : CONTENT_TYPE_MAP.default.icon
    }
    this.createdAt = args.createdAt
    this.isPublic = args.isPublic
    this.localSortOrder = args.localSortOrder || false
    this.description = args.description || undefined
    this.packages = args.packages
    this.hasPackageAssociations = args.hasPackageAssociations
    this.sortOrder = args.sortOrder || null
    this.isVisibleToPatient = args.isVisibleToPatient
  }
}
