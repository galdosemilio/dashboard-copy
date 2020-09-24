/**
 * GET /key/account
 */

export interface GetAllKeyAccountRequest {
  /** Account id to filter keys. Optional for Client requests, otherwise required. */
  account?: string;
  /** Organization id. */
  organization: string;
  /** Key name. */
  name?: string;
}
