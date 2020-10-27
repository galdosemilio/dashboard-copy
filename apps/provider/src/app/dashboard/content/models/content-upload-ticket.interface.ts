import { ContentUpload } from './content-upload.interface';
import { QueuedContent } from './queued-content.interface';

export interface ContentUploadTicket {
  number: number;
  contentUpload: ContentUpload;
  queuedContent: QueuedContent;
}
