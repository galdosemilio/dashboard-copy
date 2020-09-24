/**
 * consentTosMeta
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const consentTosMeta = createValidator({
  /** ToS group ID. */
  id: t.number,
  /** ToS title. */
  title: t.string,
  /** ToS meta-description. */
  description: optional(t.string),
  /** A flag indicating whether the ToS should be accessible to anonymous/unauthenticated users. */
  allowAnonymousAccess: optional(t.boolean)
});
