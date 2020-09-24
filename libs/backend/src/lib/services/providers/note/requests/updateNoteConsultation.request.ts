/**
 * PATCH /note/consultation/:id
 */

export interface UpdateNoteConsultationRequest {
  /** The id of the note, as the last part of the url. */
  id: string;
  /** New content for the content. */
  content?: string;
  /** The subjective of the note. */
  subjective?: string;
  /** The objective of the note. */
  objective?: string;
  /** The assessment of the note. */
  assessment?: string;
  /** The plan of the note. */
  plan?: string;
  /** New value for providerOnly. */
  providerOnly?: boolean;
  /** New value for date in 'YYYY-MM-DD' format. */
  date?: string;
  /** New values for relatedAccounts. */
  relatedAccounts?: Array<string>;
}
