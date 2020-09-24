/**
 * GET /consent/tos/:id
 */

import { ConsentTosMeta } from '../../../shared';

export interface ConsentTosSingle {
  /** ID of the ToS version. */
  id: string;
  /** ToS metadata group object. */
  meta: ConsentTosMeta;
  /** ToS content. */
  content: string;
  /** String array of organizations. */
  organizations: Array<string>;
  /** Business-oriented version number of ToS. */
  version: number;
  /** Creation date of the ToS version. */
  createdAt: string;
}
