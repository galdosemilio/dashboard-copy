/**
 * GET /warehouse/organization/activity
 */

import { createTest, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetOrganizationActivityReportsResponse } from './getOrganizationActivityReports.response';

export const getOrganizationActivityReportsResponse = createTest<
  GetOrganizationActivityReportsResponse
>('GetOrganizationActivityReportsResponse', {
  /** Array of report results. */
  data: t.array(
    createValidator({
      /** Date of the aggregation. */
      date: t.string,
      /** All aggregates for specific dates. */
      aggregates: t.array(
        createValidator({
          /** Organization object. */
          organization: createValidator({
            /** The id of organization. */
            id: t.string,
            /** The name of organization. */
            name: t.string
          }),
          /** Clients report object. */
          clients: createValidator({
            /** Number of active clients for requested organization. */
            total: t.number,
            /** Number of clients who has any API activity within requested dates range. */
            active: t.number
          }),
          /** Providers report object. */
          providers: createValidator({
            /** Number of active providers for requested organization. */
            total: t.number,
            /** Number of providers who has any API activity within requested dates range. */
            active: t.number
          })
        })
      )
    })
  )
});
