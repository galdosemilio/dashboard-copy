/**
 * DELETE /hydration
 */

export interface DeleteHydrationRequest {
  /** Account associated to post hydration. Required if requester is provider, client account id will be automatically populated. */
  account?: string;
  /** Date of entry for hydration, in YYYY-MM-DD format. */
  date: string;
}
