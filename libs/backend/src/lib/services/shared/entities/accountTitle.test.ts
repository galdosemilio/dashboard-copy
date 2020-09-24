/**
 * accountTitle
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { accountTitleId } from '../generic/index.test';

export const accountTitle = createValidator({
  /** Account title ID. */
  id: accountTitleId,
  /** Account title name. */
  name: t.string
});
