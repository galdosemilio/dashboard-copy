/**
 * POST /ccr/register
 */

import { createTest, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { ClinicRegisterResponse } from './clinicRegister.response';

export const clinicRegisterResponse = createTest<ClinicRegisterResponse>('ClinicRegisterResponse', {
  /** Id of created provider account. */
  accountId: t.string,
  /** Id of created organization. */
  organizationId: t.string,
  /**
   * Has value 'true' if passed payment data was successfully processed by web-stripe service and customer was created,
   * otherwise 'false'. Is not included at all if payment data is not provided.
   */
  isPaymentDataProcessed: optional(t.boolean)
});
