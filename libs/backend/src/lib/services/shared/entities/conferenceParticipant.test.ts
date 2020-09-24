/**
 * conferenceParticipant
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const conferenceParticipant = createValidator({
  /** Account ID. */
  id: t.string,
  /**
   * First name.
   * Account data is eventually consistent and might not _always_ be available,
   * although it should be available most of the time.
   */
  firstName: optional(t.string)
});
