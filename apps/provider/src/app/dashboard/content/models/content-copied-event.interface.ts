import { FileExplorerContent } from './file-explorer-content.model';

export interface ContentCopiedEvent {
  to: string;
  content: FileExplorerContent;
  overrideDetails: FileExplorerContent;
}
