/**
 * GET /access/account
 */

import { AccAccessSort, AccAccessType, AccountTypeId, PageOffset, PageSize } from '../../../shared';

export interface GetListAccountRequest {
  /** The ID of the account to look up the account access for. Defaults to current user if not provided. */
  account?: string;
  /** The ID of the organization to narrow down the accessible accounts. */
  organization?: string;
  /**
   * If false, result will include accounts for all child organizations for requested one.
   * Otherwise - return entries strictly for requested organization. Defaulted to 'false'.
   */
  strict?: boolean;
  /** The type of access relationship to include. If omitted, both associations and assignments are included. */
  accessType?: AccAccessType;
  /** The ID of the account type to filter the result set with. */
  accountType?: AccountTypeId;
  /** Filter query for account first or last name, or e-mail address. */
  query?: string;
  /** Page entry limit. Takes a number or can be set to 'all' to fetch all entries. */
  limit?: PageSize;
  /** The page offset. */
  offset?: PageOffset;
  /**
   * A collection of sorting options. The ordering is applied in the order of parameters passed.
   * Defaults to sorting by first name ascending.
   */
  sort?: Array<AccAccessSort>;
}
