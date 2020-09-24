/**
 * GET /warehouse/alert/preference
 */

import { createTest, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { alertType, pagination } from '../../../shared/index.test';
import { GetAllAlertsPreferenceResponse } from './getAllAlertsPreference.response';

export const getAllAlertsPreferenceResponse = createTest<GetAllAlertsPreferenceResponse>(
  'GetAllAlertsPreferenceResponse',
  {
    /** Data collection. */
    data: t.array(
      createValidator({
        /** Preference ID. */
        id: t.number,
        /** Alert type. */
        type: alertType,
        /** Organization preference. */
        organization: createValidator({
          /** Organization ID. */
          id: t.string,
          /** Organization preference entry. */
          preference: createValidator({
            /** Alert options. Value and expected structure depends on the alert type the options are set for. */
            options: t.any,
            /** Preference activity indicator. */
            isActive: t.boolean
          })
        }),
        /** Organization-account preference. Only provided when 'account' parameter is passed. */
        account: optional(
          createValidator({
            /** Organization-account preference entry. */
            preference: createValidator({
              /** Alert options. Value and expected structure depends on the alert type the options are set for. */
              options: t.any,
              /** Preference activity indicator. */
              isActive: t.boolean
            })
          })
        )
      })
    ),
    /** Pagination object. */
    pagination: pagination
  }
);
