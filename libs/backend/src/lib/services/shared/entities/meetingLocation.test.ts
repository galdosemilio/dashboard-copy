/**
 * meetingLocation
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const meetingLocation = createValidator({
  /** The street address of the meeting. */
  streetAddress: t.string,
  /** The city in which the meeting takes place. */
  city: t.string,
  /** The postal code for the address. */
  postalCode: t.string,
  /** The state in which the meeting takes palce. */
  state: t.string,
  /** The country in which the meeting takes place. */
  country: t.string,
  /** The latitude for the meeting. */
  latitude: optional(t.string),
  /** The longigtude for the meeting. */
  longitude: optional(t.string)
});
