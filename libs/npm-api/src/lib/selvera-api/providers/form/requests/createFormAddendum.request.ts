/**
 * POST /content/form/addendum
 */

export interface CreateFormAddendumRequest {
  /** submission id. */
  submission: string
  /** Addendum text content. */
  content: string
}
