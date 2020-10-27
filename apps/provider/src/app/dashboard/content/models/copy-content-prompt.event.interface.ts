import { FileExplorerRoute } from '../file-explorer-table';
import { FileExplorerContent } from './file-explorer-content.model';

export interface CopyContentPromptEvent {
  content: FileExplorerContent;
  routes?: FileExplorerRoute[];
}
