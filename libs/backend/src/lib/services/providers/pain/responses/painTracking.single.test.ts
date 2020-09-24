/**
 * GET /pain-tracking/history/:id
 */

import { createTestFromValidator, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { intervalObject, painIntensity, painLocation, painType } from '../../../shared/index.test';
import { PainTrackingSingle } from './painTracking.single';

export const painTrackingSingle = createValidator({
  /** ID of specified pain location. */
  id: t.string,
  /** Account id of specified user. */
  account: t.string,
  /** Pain region: Chest | Throat |. */
  region: t.string,
  /** Pain location - point information (x, y, z) */
  location: painLocation,
  /** Datetime of pain with time zone. */
  reportedAt: t.string,
  /** Pain interval information - at least one attribute will exist. */
  duration: optional(intervalObject),
  /** Pain type id and description information. */
  type: painType,
  /** Pain intensity in range [0, 10]. */
  intensity: painIntensity
});

export const painTrackingResponse = createTestFromValidator<PainTrackingSingle>(
  'PainTrackingSingle',
  painTrackingSingle
);
