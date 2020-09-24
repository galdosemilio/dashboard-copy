/**
 * messagingAccount
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const messagingAccount = createValidator({
  /** The account id. */
  id: t.string,
  /** The account first name. */
  firstName: optional(t.string),
  /** The account last name. */
  lastName: optional(t.string)
});
