/**
 * billingSummaryItem
 */

import { createValidator } from '@coachcare/backend/tests';
import { entity } from '../generic/index.test';
import { conferenceSubaccountInfo } from './conferenceSubaccountInfo.test';
import { measuredValue } from './measuredValue.test';

export const billingSummaryItem = createValidator({
  /** Organization information. */
  organization: entity,
  /** Subaccount information. */
  subaccount: conferenceSubaccountInfo,
  /** Count of events. */
  count: measuredValue,
  /** Price for a specific category service. */
  price: measuredValue,
  /** Usage breakdown of specific category. */
  usage: measuredValue
});
