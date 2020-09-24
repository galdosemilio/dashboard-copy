/**
 * clientData
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { gender } from './gender.test';

export const clientData = createValidator({
  /** Date of birth. */
  birthday: t.string,
  /** Height in centimeters. */
  height: t.number,
  /** Client gender. */
  gender: gender,
  /** The BMR number. */
  bmr: optional(t.number)
});
