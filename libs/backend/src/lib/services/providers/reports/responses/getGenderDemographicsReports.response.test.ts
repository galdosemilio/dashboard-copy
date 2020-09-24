/**
 * GET /warehouse/demographics/gender
 */

import { createTest, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetGenderDemographicsReportsResponse } from './getGenderDemographicsReports.response';

export const getGenderDemographicsReportsResponse = createTest<
  GetGenderDemographicsReportsResponse
>('GetGenderDemographicsReportsResponse', {
  /** Aggregate collection. */
  data: t.array(
    createValidator({
      /** Organization data. */
      organization: createValidator({
        /** Organization ID. */
        id: t.string,
        /** Organization name. */
        name: t.string
      }),
      /** Male gender breakdown. */
      male: createValidator({
        /** Count of male clients. */
        count: t.number,
        /** Percentage of male clients. */
        percentage: t.number
      }),
      /** Female gender breakdown. */
      female: createValidator({
        /** Count of female clients. */
        count: t.number,
        /** Percentage of female clients. */
        percentage: t.number
      })
    })
  )
});
