/**
 * conferenceSubaccountInfo
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const conferenceSubaccountInfo = createValidator({
  /** Subaccount Twillio ID. */
  sid: t.string,
  /** A flag indicating if subaccount is active or not. */
  isActive: t.boolean,
  /** Start date of the billing breakdown. */
  startDate: t.string,
  /** End date of the billing breakdown. */
  endDate: t.string,
  /** Billing description. */
  description: t.string,
  /** Twilio's billing category. */
  category: t.string
});
