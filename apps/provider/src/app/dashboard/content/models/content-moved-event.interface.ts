import { FileExplorerContent } from '@app/dashboard/content/models/file-explorer-content.model';

export interface ContentMovedEvent {
  from?: string;
  to: string;
  content: FileExplorerContent;
}
