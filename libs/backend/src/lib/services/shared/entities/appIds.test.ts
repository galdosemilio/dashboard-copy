/**
 * appIds
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const appIds = createValidator({
  /** Android app ID. */
  android: optional(t.string),
  /** iOS app ID. */
  ios: optional(t.string)
});
