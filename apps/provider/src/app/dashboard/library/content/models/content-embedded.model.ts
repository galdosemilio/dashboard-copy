import {
  CONTENT_TYPE_MAP,
  ContentTypeMapItem
} from '@app/dashboard/library/content/models/content-type.map'
import {
  FileExplorerContent,
  FileExplorerContentMetadata
} from '@app/dashboard/library/content/models/file-explorer-content.model'
import { Icon } from '@app/dashboard/library/content/models/icon.interface'
import { Package } from '@app/shared/components/package-table'

export class EmbeddedContent implements Partial<FileExplorerContent> {
  public name: string
  public type: ContentTypeMapItem
  public icon: Icon
  public isPublic: boolean
  public description: string
  public metadata: FileExplorerContentMetadata
  public parentId?: string
  parent?: string
  public packages?: Package[]
  public hasPackageAssociations?: boolean
  public isVisibleToPatient?: boolean

  constructor(args: any) {
    this.name = args.fullName || args.name
    this.description = args.description || undefined
    this.isPublic = args.isPublic
    this.parentId = args.parentId
    this.parent = args.parentId || args.parent
    this.metadata = args.metadata
    this.type = this.metadata.content.includes('vimeo')
      ? CONTENT_TYPE_MAP.vimeo
      : CONTENT_TYPE_MAP.youtube
    this.packages = args.packages
    this.hasPackageAssociations = args.hasPackageAssociations
    this.isVisibleToPatient = args.isVisibleToPatient
    this.icon = this.type.icon
  }
}
