import { EventEmitter } from '@angular/core'
import { FileExplorerContent } from '@app/dashboard/content/models//file-explorer-content.model'
import { ContentMovedEvent } from '@app/dashboard/content/models/content-moved-event.interface'
import { CcrDropEvent } from '@app/shared'
import { ContentCopiedEvent } from './content-copied-event.interface'
import { CopyContentPromptEvent } from './copy-content-prompt.event.interface'

export class FileExplorerEvents {
  public contentAdded: EventEmitter<FileExplorerContent>
  public resetFiles: EventEmitter<void>
  public updateContent: EventEmitter<FileExplorerContent>
  public updateContentPrompt: EventEmitter<FileExplorerContent>
  public contentUpdated: EventEmitter<FileExplorerContent>
  public deleteContent: EventEmitter<FileExplorerContent>
  public contentDeleted: EventEmitter<FileExplorerContent>
  public contentSelected: EventEmitter<FileExplorerContent>
  public moveContent: EventEmitter<ContentMovedEvent>
  public moveContentPrompt: EventEmitter<FileExplorerContent>
  public contentMoved: EventEmitter<ContentMovedEvent>
  public openContent: EventEmitter<FileExplorerContent>
  public filtered: EventEmitter<void>
  public contentSorted: EventEmitter<CcrDropEvent>
  public copyContent: EventEmitter<ContentCopiedEvent>
  public copyContentPrompt: EventEmitter<CopyContentPromptEvent>
  public contentChecked: EventEmitter<FileExplorerContent>
  public contentUnchecked: EventEmitter<FileExplorerContent>

  constructor() {
    this.contentAdded = new EventEmitter<FileExplorerContent>()
    this.resetFiles = new EventEmitter<void>()
    this.updateContent = new EventEmitter<FileExplorerContent>()
    this.updateContentPrompt = new EventEmitter<FileExplorerContent>()
    this.contentUpdated = new EventEmitter<FileExplorerContent>()
    this.deleteContent = new EventEmitter<FileExplorerContent>()
    this.contentDeleted = new EventEmitter<FileExplorerContent>()
    this.contentSelected = new EventEmitter<FileExplorerContent>()
    this.moveContent = new EventEmitter<ContentMovedEvent>()
    this.moveContentPrompt = new EventEmitter<FileExplorerContent>()
    this.contentMoved = new EventEmitter<ContentMovedEvent>()
    this.openContent = new EventEmitter<FileExplorerContent>()
    this.filtered = new EventEmitter<void>()
    this.contentSorted = new EventEmitter<CcrDropEvent>()
    this.copyContent = new EventEmitter<ContentCopiedEvent>()
    this.copyContentPrompt = new EventEmitter<CopyContentPromptEvent>()
    this.contentChecked = new EventEmitter<FileExplorerContent>()
    this.contentUnchecked = new EventEmitter<FileExplorerContent>()
  }
}
