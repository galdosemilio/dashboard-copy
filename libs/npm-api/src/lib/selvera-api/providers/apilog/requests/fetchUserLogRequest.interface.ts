/**
 * GET /log/:account
 */

export interface FetchUserLogRequest {
  account: string | number;
  offset?: number;
  // limit: 25
}
