/**
 * GET /meeting/type/:typeId
 */

import { createTestFromValidator, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { MeetingTypeSingle } from './meetingType.single';

export const meetingTypeSingle = createValidator({
  /** Meeting type ID. */
  id: t.number,
  /** Meeting type code. */
  code: optional(t.string),
  /** Meeting type description. */
  description: t.string,
  /** A flag indicating if a meeting type is currently active. */
  isActive: t.boolean
});

export const meetingTypeResponse = createTestFromValidator<MeetingTypeSingle>(
  'MeetingTypeSingle',
  meetingTypeSingle
);
