/**
 * GET /account
 */

import { PageOffset, PageSize } from '../../content/entities'
import { AccountTypeId, AccSort } from '../entities'

export interface GetAllAccountRequest {
  /** Sets filter to include responses that match to first name, last name, email address. */
  query?: string
  /** Fetch only account type(s) that match this account_type. */
  accountType?: AccountTypeId
  /**
   * Return listing of clients associated with this organization, ignored for admin account types.
   * Required if requester is provider.
   */
  organization?: string
  /** Flag that indicates whether the result should include not active accounts. */
  includeInactive?: boolean
  /** Page entry limit. Takes a number or can be set to 'all' to fetch all entries. */
  limit?: PageSize
  /** The page offset. */
  offset?: PageOffset
  /** A collection that determines how the result should be sorted. */
  sort?: Array<AccSort>
}
