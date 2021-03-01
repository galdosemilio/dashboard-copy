export * from './components'
export * from './dialogs'
export * from './forms'
export * from './file-explorer/file-explorer.component'
export * from './file-explorer-content/file-explorer-content.component'
export * from './file-explorer-content-selector/file-explorer-content-selector.component'
export * from './file-explorer-details/file-explorer-details.component'
export * from './file-explorer-grid/file-explorer-grid.component'
export * from './file-explorer-inline-editor/file-explorer-inline-editor.component'
export * from './file-explorer-list/file-explorer-list.component'
export * from './file-explorer-table/file-explorer-table.component'
export * from './file-upload-tracker/file-upload-tracker.component'
export * from './content.component'
export * from './file-explorer-table'

import { ContentSharedComponents } from './components/components.barrel'
import { ContentComponent } from './content.component'
import {
  ContentBatchCopyDialog,
  ContentCreateDialog,
  ContentEditDialog,
  ContentMoveDialog,
  EmbeddedContentViewerComponent,
  FolderCreateDialog,
  FormPreviewDialog,
  InsertFormDialog,
  PackageSelectDialog
} from './dialogs'
import { FileExplorerContentSelectorComponent } from './file-explorer-content-selector/file-explorer-content-selector.component'
import { FileExplorerContentComponent } from './file-explorer-content/file-explorer-content.component'
import { FileExplorerDetailsComponent } from './file-explorer-details/file-explorer-details.component'
import { FileExplorerGridComponent } from './file-explorer-grid/file-explorer-grid.component'
import { FileExplorerInlineEditorComponent } from './file-explorer-inline-editor/file-explorer-inline-editor.component'
import { FileExplorerListComponent } from './file-explorer-list/file-explorer-list.component'
import { FileExplorerTableComponent } from './file-explorer-table/file-explorer-table.component'
import { FileExplorerComponent } from './file-explorer/file-explorer.component'
import { FileUploadTrackerComponent } from './file-upload-tracker/file-upload-tracker.component'
import {
  ContentFormComponent,
  FileFormComponent,
  HyperlinkFormComponent,
  VimeoFormComponent,
  YoutubeFormComponent
} from './forms'
import {
  ContentUploadService,
  FileExplorerDatabase,
  FileUploadGuard
} from './services'

export const ContentComponents = [
  ...ContentSharedComponents,
  FileExplorerTableComponent,
  ContentComponent,
  ContentBatchCopyDialog,
  ContentCreateDialog,
  ContentEditDialog,
  ContentMoveDialog,
  ContentFormComponent,
  EmbeddedContentViewerComponent,
  FileExplorerComponent,
  FileExplorerContentComponent,
  FileExplorerContentSelectorComponent,
  FileExplorerDetailsComponent,
  FileExplorerGridComponent,
  FileExplorerInlineEditorComponent,
  FileExplorerListComponent,
  FileFormComponent,
  FileUploadTrackerComponent,
  FolderCreateDialog,
  FormPreviewDialog,
  InsertFormDialog,
  PackageSelectDialog,
  HyperlinkFormComponent,
  VimeoFormComponent,
  YoutubeFormComponent
]

export const ContentEntryComponents = [
  ContentBatchCopyDialog,
  ContentCreateDialog,
  ContentEditDialog,
  ContentMoveDialog,
  EmbeddedContentViewerComponent,
  FolderCreateDialog,
  FormPreviewDialog,
  InsertFormDialog,
  PackageSelectDialog
]

export const ContentProviders = [
  ContentUploadService,
  FileExplorerDatabase,
  FileUploadGuard
]
