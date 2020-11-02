/**
 * Interface for GET /note/general (response)
 */

import { FetchNoteResponse } from './fetchNoteResponse.interface';
import { PaginationResponse } from './paginationResponse.interface';

export interface FetchAllNotesResponse {
    data: Array<FetchNoteResponse>;
    pagination: PaginationResponse;
}
