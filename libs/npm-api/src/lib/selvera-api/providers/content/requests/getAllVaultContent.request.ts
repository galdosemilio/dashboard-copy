import { ContentSort } from '../entities';

export interface GetAllVaultContentRequest {
    /** Account to retrieve the content items for */
    account: string;
    /** A collection of MIME types to filter by. Only used when 'type' parameter indicates a file. */
    mimeType?: string[];
    /** Page size. Can either be "all" (a string) or a number */
    limit?: number | 'all';
    /** Number of items to offset from beginning of the result set */
    offset?: number;
    /** Organization to retrieve the content items for */
    organization: string;
    /** ID of the parent item. Disregarded if 'searchMode = deep'. */
    parent?: string;
    /** Query to search for in the item names and description */
    query?: string;
    /** Search in 'shallow' mode retrieves items for the selected level of the tree only, while 'deep' mode searches across all content trees. Also, 'deep' mode completely discards 'parentId' parameter. */
    search?: 'shallow' | 'deep';
    /** A collection that determines how the result should be sorted */
    sort?: ContentSort[];
    /** Indicates whether the content should be only retrieved for the most specific organization, or the whole hierarchy. */
    strict?: boolean;
    /** Item type ID to filter by */
    type?: string;
}
