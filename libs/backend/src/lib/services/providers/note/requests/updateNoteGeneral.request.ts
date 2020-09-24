/**
 * PATCH /note/general/:id
 */

export interface UpdateNoteGeneralRequest {
  /** The id of the note, as the last part of the url. */
  id: string;
  /** New content for the content. */
  content?: string;
  /** New value for providerOnly. */
  providerOnly?: boolean;
  /** New value for date in 'YYYY-MM-DD' format. */
  date?: string;
  /** New values for relatedAccounts. */
  relatedAccounts?: Array<string>;
}
