/**
 * GET /note/general
 */

import { Pagination } from '../../../shared';

export interface GetAllNoteGeneralResponse {
  /** Array of notes. */
  data: Array<{
    /** The ID of the note. */
    noteId: string;
    /** The text of the note. */
    content: string;
    /** The id of the note's creator. */
    createdBy: string;
    /** Is the note provider only?. */
    providerOnly: boolean;
    /** The time the note was created in ISO8601 format. */
    createdAt: string;
    /** The time the note was updated in ISO8601 format. */
    updatedAt: string;
    /** The date of the note in 'YYYY-MM-DD' format. */
    date: string;
    /** The relatedAccounts for the note, only if the requester is a provider. */
    relatedAccounts?: Array<string>;
  }>;
  /** Pagination object. */
  pagination: Pagination;
}
