/**
 * GET /content
 */

import { ContentSort, PageOffset, PageSize } from '../../../shared';

export interface GetAllContentRequest {
  /** Organization to retrieve the content items for. */
  organization: string;
  /** Indicates whether the content should be only retrieved for the most specific organization, or the whole hierarchy. */
  strict?: boolean;
  /** Query to search for in the item names and description. */
  query?: string;
  /** Item type ID to filter by. */
  type?: number;
  /** A collection of MIME types to filter by. Only used when 'type' parameter indicates a file. */
  mimeType?: Array<string>;
  /** ID of the parent item. */
  parentId?: string;
  /** A collection that determines how the result should be sorted. */
  sort?: Array<ContentSort>;
  /** Page size. Can either be "all" (a string) or a number. */
  limit?: PageSize;
  /** Number of items to offset from beginning of the result set. */
  offset?: PageOffset;
}
