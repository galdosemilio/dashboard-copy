/**
 * GET /consent
 */

import { ConsentSegment } from '../../../shared';

export interface GetAllConsentResponse {
  /** Collection of consents. */
  consents: Array<ConsentSegment>;
}
