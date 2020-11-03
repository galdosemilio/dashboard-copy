import { ContentFile } from '@app/dashboard/content/models/content-file.model';
import { ContentTypeMapItem } from '@app/dashboard/content/models/content-type.map';
import { FileExplorerContent } from '@app/dashboard/content/models/file-explorer-content.model';

export interface QueuedContent {
  details: ContentFile;
  file?: File;
  type: ContentTypeMapItem;
  url?: string;
  destination: FileExplorerContent;
}
