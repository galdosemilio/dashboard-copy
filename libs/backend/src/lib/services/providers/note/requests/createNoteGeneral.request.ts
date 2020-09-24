/**
 * POST /note/general
 */

export interface CreateNoteGeneralRequest {
  /** The content of the note. */
  content: string;
  /** If true, the note is only visible to providers. Can only be true if user is provider. (microservice: required) */
  providerOnly?: boolean;
  /** The time of the note in ISO8601 format. */
  time?: string;
  /**
   * Accounts related to the note. If a provider, provides access to the note.
   * If a client, indicates that the client is a subject of the note and, if not providerOnly, provides access to the note.
   */
  relatedAccounts?: Array<string>;
}
