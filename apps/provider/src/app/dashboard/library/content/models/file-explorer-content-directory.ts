import { FileExplorerDatasource } from '../services'
import { FileExplorerContent } from './file-explorer-content.model'

export interface FileExplorerContentDirectoryOpts {
  disableForeign?: boolean
  enableDrag?: boolean
  enableDrop?: boolean
}

export class FileExplorerContentDirectory {
  content: FileExplorerContent
  disabled?: boolean
  draggableDirectory?: FileExplorerContentDirectory
  isDraggable?: boolean
  isDroppable?: boolean
  isOpen?: boolean
  source?: FileExplorerDatasource

  constructor(args, opts: FileExplorerContentDirectoryOpts = {}) {
    this.content = args.content
    this.disabled = opts.disableForeign && this.content.isForeign
    this.source = undefined
    this.isOpen = false

    this.draggableDirectory = { content: args.content, isOpen: args.isOpen }
    this.isDraggable = opts.enableDrag && !args.content.isForeign
    this.isDroppable =
      opts.enableDrop && args.content.isFolder && !args.content.isForeign
  }
}
