/**
 * GET /note/general
 */

import { PageOffset, PageSize } from '../../../shared';

export interface GetAllNoteGeneralRequest {
  /** Search only for notes relating to this account. */
  account?: string;
  /**
   * Find only matching notes. Depending on the contents of the search string, one of two search strategies are used.
   * Usually, a semantic search is done.
   * However, if the string contains a "_" or "%", the search is treated as a postgres LIKE pattern,
   * where "_" stands for any single character and "%" is any sequence of zero or more characters.
   */
  search?: string;
  /** Select notes with dates on or after this date, in ISO_8601 format. */
  startDate?: string;
  /** Select notes with dates on or before this date, in ISO_8601 format. */
  endDate?: string;
  /** Page size. Can be set to 'all' to retrieve all entries. */
  limit?: PageSize;
  /** Page offset. */
  offset?: PageOffset;
}
