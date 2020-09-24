/**
 * GET /available/:id
 */

import { createTestFromValidator, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { ScheduleAvailableSingle } from './scheduleAvailable.single';

export const scheduleAvailableSingle = createValidator({
  /** The id of this record. */
  id: t.string,
  /** The day this record corresonds to (0-6 :: Sunday - Saturday) */
  day: t.number,
  /** The account this record is connected to. */
  account: t.string,
  /** The start time of this record, in 24-hour format in 5 minute increments.  00:00 - 24:00. */
  startTime: t.string,
  /** The end time of this record, in 24-hour format in 5 minute increments.  00:00 - 24:00. */
  endTime: t.string,
  /** The timezone the availability corresponds to. */
  timezone: t.string
});

export const scheduleAvailableResponse = createTestFromValidator<ScheduleAvailableSingle>(
  'ScheduleAvailableSingle',
  scheduleAvailableSingle
);
