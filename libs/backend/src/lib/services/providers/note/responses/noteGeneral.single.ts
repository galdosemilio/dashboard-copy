/**
 * GET /note/general/:id
 */

export interface NoteGeneralSingle {
  /** The ID of the note. */
  noteId: string;
  /** Content of the note. */
  content: string;
  /** Note creator. */
  createdBy: string;
  /** Whether is visible only for providers or not. */
  providerOnly: boolean;
  /** Creation timestamp. */
  createdAt: string;
  /** Update timestamp. */
  updatedAt: string;
  /** Note date. */
  date: string;
  /** Related accounts. */
  relatedAccounts: Array<string>;
}
