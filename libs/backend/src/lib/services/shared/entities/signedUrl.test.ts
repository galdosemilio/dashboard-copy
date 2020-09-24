/**
 * signedUrl
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const signedUrl = createValidator({
  /** Asset name. */
  name: t.string,
  /** Upload URL. */
  url: t.string
});
