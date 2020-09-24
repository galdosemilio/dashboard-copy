/**
 * consentSegment
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { consentAction } from './consentAction.test';

export const consentSegment = createValidator({
  /** ID of the consent. */
  id: t.string,
  /** Account for which the consent is intended. */
  account: t.string,
  /** Account which has actually submitted the consent. */
  createdBy: t.string,
  /** ID of the ToS version the action was taken upon. */
  tosVersionId: t.string,
  /** Action taken. */
  action: consentAction,
  /** Organization for which the action was taken. Can be null for personal account consents. */
  organization: optional(t.string),
  /** Creation date of the consent. */
  timestamp: t.string
});
