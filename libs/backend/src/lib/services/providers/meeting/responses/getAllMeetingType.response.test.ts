/**
 * GET /meeting/type
 */

import { createTest, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetAllMeetingTypeResponse } from './getAllMeetingType.response';

export const getAllMeetingTypeResponse = createTest<GetAllMeetingTypeResponse>(
  'GetAllMeetingTypeResponse',
  {
    /** Collection of meeting types. */
    types: t.array(
      createValidator({
        /** Meeting type ID. */
        id: t.number,
        /** Meeting type code. */
        code: optional(t.string),
        /** Meeting type description. */
        description: t.string,
        /**
         * A flag indicating if a meeting type is currently active.
         * Only included in the response if 'includeInactive' flag is set to 'true'.
         */
        isActive: optional(t.boolean)
      })
    )
  }
);
