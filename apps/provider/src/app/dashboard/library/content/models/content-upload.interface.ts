import { ContentFile } from '@app/dashboard/library/content/models/content-file.model'
import { FileExplorerContent } from '@app/dashboard/library/content/models/file-explorer-content.model'
import { EmbeddedContent } from '@app/dashboard/library/content/models/content-embedded.model'
import { Subscription } from 'rxjs'

export interface ContentUpload {
  content: ContentFile | FileExplorerContent | EmbeddedContent
  progress?: number
  error?: string
  hidden?: boolean
  subscription?: Subscription
  id?: string
  mature?: boolean
}
