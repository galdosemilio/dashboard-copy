/**
 * ConsentSegment
 */

import { ConsentAction } from './consentAction';

export interface ConsentSegment {
  /** ID of the consent. */
  id: string;
  /** Account for which the consent is intended. */
  account: string;
  /** Account which has actually submitted the consent. */
  createdBy: string;
  /** ID of the ToS version the action was taken upon. */
  tosVersionId: string;
  /** Action taken. */
  action: ConsentAction;
  /** Organization for which the action was taken. Can be null for personal account consents. */
  organization?: string;
  /** Creation date of the consent. */
  timestamp: string;
}
