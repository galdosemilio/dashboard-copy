import { ContentFile } from '@app/dashboard/content/models/content-file.model'
import { FileExplorerContent } from '@app/dashboard/content/models/file-explorer-content.model'
import { Subscription } from 'rxjs'

export interface ContentUpload {
  content: ContentFile | FileExplorerContent
  progress?: number
  error?: string
  hidden?: boolean
  subscription?: Subscription
  id?: string
  mature?: boolean
}
