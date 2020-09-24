/**
 * GET /meeting/type/organization/:organization
 */

import { createTest, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetAllMeetingTypeOrganizationResponse } from './getAllMeetingTypeOrganization.response';

export const getAllMeetingTypeOrganizationResponse = createTest<
  GetAllMeetingTypeOrganizationResponse
>('GetAllMeetingTypeOrganizationResponse', {
  /** An array of meeting-types objects. */
  meetingTypes: t.array(
    createValidator({
      /** The id of this meeting-type. */
      typeId: t.number,
      /** The code of this meeting-type. */
      code: t.string,
      /** The description of this meeting-type. */
      description: t.string,
      /** The status of this meeting-type. */
      isActive: t.boolean,
      /** The collection of durations (Postgres intervals) for a meeting type for this organization. */
      durations: t.array(t.string)
    })
  )
});
