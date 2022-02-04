import { ContentFile } from '@app/dashboard/library/content/models/content-file.model'
import { ContentTypeMapItem } from '@app/dashboard/library/content/models/content-type.map'
import { FileExplorerContent } from '@app/dashboard/library/content/models/file-explorer-content.model'

export interface QueuedContent {
  details: ContentFile
  file?: File
  type: ContentTypeMapItem
  url?: string
  destination: FileExplorerContent
}
